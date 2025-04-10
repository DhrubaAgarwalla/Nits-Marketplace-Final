const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Path to the public directory
const publicDir = path.join(__dirname, '../public');

// Function to convert an image to WebP
async function convertToWebP(inputPath, outputPath, quality = 85) {
  try {
    await sharp(inputPath)
      .webp({ quality })
      .toFile(outputPath);
    
    console.log(`✅ Converted: ${path.basename(inputPath)} → ${path.basename(outputPath)}`);
    
    // Get file sizes for comparison
    const originalSize = (fs.statSync(inputPath).size / 1024).toFixed(2);
    const webpSize = (fs.statSync(outputPath).size / 1024).toFixed(2);
    const savings = (originalSize - webpSize).toFixed(2);
    
    console.log(`   Original: ${originalSize} KiB`);
    console.log(`   WebP: ${webpSize} KiB`);
    console.log(`   Savings: ${savings} KiB (${((savings / originalSize) * 100).toFixed(2)}%)`);
  } catch (error) {
    console.error(`❌ Error converting ${inputPath}:`, error);
  }
}

// Convert the header image
(async () => {
  const headerImage = path.join(publicDir, 'header3 (1).jpeg');
  const outputWebP = path.join(publicDir, 'header3.webp');
  
  if (fs.existsSync(headerImage)) {
    await convertToWebP(headerImage, outputWebP);
  } else {
    console.error(`❌ Header image not found at: ${headerImage}`);
  }
})();
