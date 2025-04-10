/**
 * This script optimizes images for the NITS BAZAAR application
 * It converts JPEG/PNG images to WebP format and optimizes them
 * 
 * Usage:
 * 1. Install sharp: npm install sharp
 * 2. Run: node scripts/optimize-images.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

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

// Function to create a low-quality placeholder image
async function createPlaceholder(inputPath, outputPath, width = 20) {
  try {
    await sharp(inputPath)
      .resize(width)
      .blur(5)
      .toFile(outputPath);
    
    console.log(`✅ Created placeholder: ${path.basename(outputPath)}`);
  } catch (error) {
    console.error(`❌ Error creating placeholder for ${inputPath}:`, error);
  }
}

// Function to process all images in a directory
async function processImages() {
  console.log('🔍 Scanning for images...');
  
  // Process the header image
  const headerImage = path.join(publicDir, 'header3 (1).jpeg');
  const headerWebP = path.join(publicDir, 'header3.webp');
  const headerPlaceholder = path.join(publicDir, 'header3-placeholder.jpg');
  
  if (fs.existsSync(headerImage)) {
    await convertToWebP(headerImage, headerWebP);
    await createPlaceholder(headerImage, headerPlaceholder);
  } else {
    console.error(`❌ Header image not found at: ${headerImage}`);
  }
  
  console.log('\n✨ Image optimization complete!');
  console.log('📋 Summary:');
  console.log('   - Converted header image to WebP format');
  console.log('   - Created low-quality placeholder for progressive loading');
  console.log('   - Reduced file size for faster loading');
}

// Run the image processing
processImages().catch(err => {
  console.error('Error processing images:', err);
  process.exit(1);
});
