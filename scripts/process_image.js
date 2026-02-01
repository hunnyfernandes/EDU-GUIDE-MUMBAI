const fs = require('fs');
const path = require('path');

const imagePath = 'C:/Users/ferna/.gemini/antigravity/brain/beb9a2e7-fa0c-451d-ba05-22ed7eb5bf24/uploaded_image_1766166041542.png';
const outputPath = 'd:/React project/Vs-Code/SPM Projects/edu-guide-mumbai/frontend/src/assets/images.js';

try {
    if (fs.existsSync(imagePath)) {
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');
        const dataUrl = `data:image/png;base64,${base64Image}`;

        const fileContent = `export const COLLEGE_HERO_IMAGE = "${dataUrl}";\n`;

        // Ensure directory exists
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(outputPath, fileContent);
        console.log('Successfully created images.js with Base64 image.');
    } else {
        console.error('Image file not found:', imagePath);
    }
} catch (error) {
    console.error('Error processing image:', error);
}
