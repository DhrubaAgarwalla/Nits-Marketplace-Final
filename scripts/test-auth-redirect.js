/**
 * This script helps test the authentication redirect flow
 * Run it with: node scripts/test-auth-redirect.js YOUR_VERCEL_URL
 */

const vercelUrl = process.argv[2];

if (!vercelUrl) {
  console.error('Please provide your Vercel URL as an argument');
  console.error('Example: node scripts/test-auth-redirect.js https://your-project-name.vercel.app');
  process.exit(1);
}

// Validate URL format
try {
  new URL(vercelUrl);
} catch (e) {
  console.error('Invalid URL format. Please provide a valid URL.');
  console.error('Example: node scripts/test-auth-redirect.js https://your-project-name.vercel.app');
  process.exit(1);
}

console.log('\n=== Authentication Redirect Configuration Checker ===\n');
console.log(`Vercel Deployment URL: ${vercelUrl}`);

const callbackUrl = `${vercelUrl}/auth/callback`;
console.log(`Auth Callback URL: ${callbackUrl}`);

console.log('\n=== Supabase Configuration Instructions ===\n');
console.log('1. Go to Supabase Dashboard: https://app.supabase.io/');
console.log('2. Select your project');
console.log('3. Navigate to Authentication > URL Configuration');
console.log('4. Update the following settings:');
console.log('\n   Site URL:');
console.log(`   ${vercelUrl}`);
console.log('\n   Redirect URLs (add this to existing URLs):');
console.log(`   ${callbackUrl}`);

console.log('\n=== Testing Instructions ===\n');
console.log('After updating Supabase settings:');
console.log('1. Visit your Vercel deployment URL');
console.log('2. Try to sign in with your institute email');
console.log('3. After receiving the email and clicking the link, you should be properly redirected');

console.log('\n=== Troubleshooting ===\n');
console.log('If issues persist:');
console.log('- Check browser console for errors');
console.log('- Verify Supabase environment variables in Vercel');
console.log('- Check Supabase authentication logs');
console.log('- Try clearing browser cache or using incognito mode');
console.log('\nFor more details, see: docs/fix-vercel-auth-redirect.md');
