# Firefly Prompt Wizard

A simple web application that generates Firefly-themed Mad Libs stories based on user input. The application allows users to fill in various parts of speech and generates a story that can be copied to the clipboard.

## Features

- Interactive form with dropdown and text inputs
- Dynamic story generation
- Copy to clipboard functionality
- Modern, responsive design

## Installation

1. Make sure you have Node.js installed on your system
2. Clone this repository
3. Install dependencies:
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