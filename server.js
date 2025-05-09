const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the public directory
app.use(express.static('public'));

// Read configuration from config.json
function readConfig() {
    const configPath = path.join(__dirname, 'config.json');
    const configData = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(configData);
}

// Generate form content based on configuration
function generateFormContent(config) {
    return config.fields.map(field => {
        if (field.type === 'select') {
            const options = field.options.map(opt => 
                `<option value="${opt.value}">${opt.label}</option>`
            ).join('');
            return `
                <div class="form-group">
                    <label for="${field.id}">${field.label}</label>
                    <select id="${field.id}" name="${field.id}" onchange="updatePrompt()" required>
                        <option value="">Select ${field.label}</option>
                        ${options}
                    </select>
                </div>`;
        } else {
            return `
                <div class="form-group">
                    <label for="${field.id}">${field.label}</label>
                    <input type="${field.type}" id="${field.id}" name="${field.id}" onchange="updatePrompt()" oninput="updatePrompt()" required>
                </div>`;
        }
    }).join('');
}

// Generate JavaScript for form handling
function generateFormJavaScript(config) {
    const fieldIds = config.fields.map(field => field.id);
    const replacements = fieldIds.map(id => 
        'story = story.replace(new RegExp("\\\\${' + id + '}", "g"), document.getElementById("' + id + '").value || "_____");'
    ).join('\n');
    
    return `
        const storyTemplate = "${config.storyTemplate.replace(/"/g, '\\"')}";
        
        function updatePrompt() {
            let story = storyTemplate;
            ${replacements}
            document.getElementById('storyText').textContent = story;

            // Check if all required fields are filled
            const allFieldsFilled = ${fieldIds.map(id => 
                `document.getElementById('${id}').value.trim() !== ''`
            ).join(' && ')};

            // Show/hide the result section based on field completion
            document.getElementById('result').style.display = allFieldsFilled ? 'block' : 'none';
        }

        // Initial update
        window.onload = updatePrompt;

        document.getElementById('madlibForm').addEventListener('submit', function(e) {
            e.preventDefault();
            updatePrompt();
            
            ${config.url ? `
            // Wait 2 seconds before opening the URL in the Firefly window
            setTimeout(() => {
                window.open('${config.url}', 'Firefly');
            }, 2000);` : ''}
        });

        document.getElementById('refreshButton').addEventListener('click', function() {
            document.getElementById('madlibForm').reset();
            updatePrompt();
        });

        document.getElementById('copyButton').addEventListener('click', function() {
            const storyText = document.getElementById('storyText').textContent;
            navigator.clipboard.writeText(storyText).then(() => {
                this.textContent = 'Copied!';
                setTimeout(() => {
                    this.textContent = 'Copy to Clipboard';
                }, 2000);
            });
        });
    `;
}

// Generate HTML content using template
function generateHTMLContent(config, darkMode = false) {
    const templatePath = path.join(__dirname, 'public', 'template.html');
    let template = fs.readFileSync(templatePath, 'utf8');
    
    const formContent = generateFormContent(config);
    const formJavaScript = generateFormJavaScript(config);
    
    // Replace all placeholders in the template
    const replacements = {
        '{{title}}': config.title,
        '{{darkModeClass}}': darkMode ? 'dark-mode' : '',
        '{{formContent}}': formContent,
        '{{formJavaScript}}': formJavaScript
    };

    // Replace all placeholders
    Object.entries(replacements).forEach(([placeholder, value]) => {
        template = template.replace(new RegExp(placeholder, 'g'), value);
    });
    
    return template;
}

// Generate static HTML files
function generateHTMLFiles() {
    const config = readConfig();
    const dynamicHtml = generateHTMLContent(config, false);
    const staticHtml = generateHTMLContent(config, false);
    
    fs.writeFileSync(path.join(__dirname, 'public', 'index.html'), dynamicHtml);
    fs.writeFileSync(path.join(__dirname, 'public', 'static.html'), staticHtml);
}

// Watch for changes in config.json
fs.watch(path.join(__dirname, 'config.json'), (eventType) => {
    if (eventType === 'change') {
        console.log('Config file changed, regenerating HTML files...');
        generateHTMLFiles();
    }
});

// Generate initial HTML files
generateHTMLFiles();

// Routes
app.get('/', (req, res) => {
    const config = readConfig();
    const darkMode = req.query.darkMode === 'true';
    const html = generateHTMLContent(config, darkMode);
    res.send(html);
});

app.get('/static', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'static.html'));
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Static version available at http://localhost:${port}/static`);
}); 