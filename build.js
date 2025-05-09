const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, 'docs');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

// Copy public directory contents to dist
const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
    execSync(`cp -r ${publicDir}/* ${distDir}/`);
}

// Read and process config.json
const configPath = path.join(__dirname, 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Generate the static HTML
const templatePath = path.join(__dirname, 'public', 'template.html');
let template = fs.readFileSync(templatePath, 'utf8');

// Generate form content
const formContent = config.fields.map(field => {
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

// Generate JavaScript
const fieldIds = config.fields.map(field => field.id);
const replacements = fieldIds.map(id => 
    'story = story.replace(new RegExp("\\\\${' + id + '}", "g"), document.getElementById("' + id + '").value || "_____");'
).join('\n');

const formJavaScript = `
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

// Replace placeholders in template
const templateReplacements = {
    '{{title}}': config.title,
    '{{darkModeClass}}': '',
    '{{formContent}}': formContent,
    '{{formJavaScript}}': formJavaScript
};

Object.entries(templateReplacements).forEach(([placeholder, value]) => {
    template = template.replace(new RegExp(placeholder, 'g'), value);
});

// Convert absolute paths to relative paths
template = template
    .replace(/href="\/([^"]+)"/g, 'href="$1"')
    .replace(/src="\/([^"]+)"/g, 'src="$1"');

// Write the static HTML file
fs.writeFileSync(path.join(distDir, 'index.html'), template);

console.log('Static site built successfully in the dist directory!'); 