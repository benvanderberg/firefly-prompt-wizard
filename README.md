# Firefly prompt wizard

A simple web application that generates Firefly-themed Mad Libs stories based on user input. The application allows users to fill in various parts of speech and generates a story that can be copied to the clipboard.

## Features

- Interactive form with dropdown and text inputs
- Dynamic story generation
- Copy to clipboard functionality
- Modern, responsive design

## Installation

### Installing Node.js

1. **Download Node.js**:
   - Visit [nodejs.org](https://nodejs.org)
   - Download the "LTS" (Long Term Support) version for your operating system
   - The website will automatically detect your operating system and show the correct version

2. **Install Node.js**:
   - **Windows**: Run the downloaded `.msi` installer and follow the installation wizard
   - **macOS**: Run the downloaded `.pkg` installer and follow the installation wizard
   - **Linux**: Use your package manager:
     ```bash
     # Ubuntu/Debian
     sudo apt update
     sudo apt install nodejs npm

     # Fedora
     sudo dnf install nodejs npm
     ```

3. **Verify Installation**:
   Open a terminal/command prompt and run:
   ```bash
   node --version
   npm --version
   ```
   Both commands should display version numbers if the installation was successful.

### Installing the Application

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/firefly-prompt-wizard.git
   cd firefly-prompt-wizard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

1. Start the server:
   ```bash
   npm start
   ```
2. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Fill out the form with your desired words
2. Click "Generate Story" to create your Mad Libs story
3. Use the "Copy to Clipboard" button to copy the generated story 

## Configuration

The application can be customized by modifying the `config.json` file. This file controls the form fields, options, and the story template.

### Basic Configuration

The `config.json` file has the following main properties:

- `title`: The title of your application
- `url`: The URL where the generated prompt will be used
- `darkMode`: Boolean to enable/disable dark mode
- `fields`: Array of form fields
- `storyTemplate`: The template string for generating the story

### Adding or Modifying Fields

Each field in the `fields` array has the following structure:

```json
{
    "id": "unique_field_id",
    "label": "Display Label",
    "type": "select",  // or "text" for free-form input
    "options": [       // only required for "select" type
        {"value": "value1", "label": "Display Label 1"},
        {"value": "value2", "label": "Display Label 2"}
    ]
}
```

To add a new field:
1. Add a new object to the `fields` array
2. Choose a unique `id`
3. Set the `label` that will be displayed to users
4. Choose the field `type` ("select" or "text")
5. If using "select" type, add an array of `options`

### Customizing the Story Template

The `storyTemplate` property uses template literals with `${fieldId}` syntax to insert field values. For example:

```json
"storyTemplate": "${animal} is ${action} ${place}"
```

To modify the template:
1. Use the field IDs from your fields array
2. Wrap them in `${}` syntax
3. Add any additional text or formatting as needed

## Deployment

To deploy the application to a hosting service:

1. Build the static version:
   ```bash
   npm run build
   ```
   This will create a `dist` directory containing the static version of the site.

2. Choose a hosting platform that supports static websites. Here are some popular options:

   - **GitHub Pages**:
     - Create a new repository
     - Push the contents of the `dist` directory to the repository
     - Enable GitHub Pages in the repository settings

3. After deployment, your application will be available at the URL provided by your hosting service.

Note: The static version includes all the same functionality as the dynamic version, but runs entirely in the browser without requiring a Node.js server. 
