# Performance Optimization Scripts

This directory contains scripts to optimize the performance of the NITS BAZAAR application.

## Image Conversion Script

The `convert-to-webp.js` script converts JPEG/PNG images to the WebP format, which provides better compression and faster loading times.

### Prerequisites

Before running the script, make sure you have the required dependencies:

```bash
npm install sharp
```

### Usage

To convert the header image to WebP format:

```bash
node scripts/convert-to-webp.js
```

This will:
1. Convert the header image (`/public/header3 (1).jpeg`) to WebP format
2. Save it as `/public/header3.webp`
3. Display the file size savings

### Benefits

- Reduces image file size by approximately 50-80%
- Improves page load time
- Reduces bandwidth usage for mobile users
- Improves Lighthouse performance score

## Additional Performance Optimizations

The following optimizations have been implemented in the codebase:

1. **Image Optimization**
   - Converted JPEG images to WebP format
   - Implemented next/image component with proper sizing
   - Added blur placeholders for better loading experience

2. **JavaScript Optimization**
   - Implemented dynamic imports for heavy components
   - Reduced unused JavaScript
   - Deferred non-critical JavaScript

3. **Critical Request Chain Optimization**
   - Added preload links for critical resources
   - Optimized loading order of resources

4. **Mobile Optimization**
   - Reduced image sizes for mobile devices
   - Optimized layout for mobile screens
   - Implemented responsive image sizing
