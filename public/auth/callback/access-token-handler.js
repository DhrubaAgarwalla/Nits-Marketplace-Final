// This script runs on the client side to handle access tokens in the URL hash
// It's a simple script that will be included in the callback page

(function() {
  // Function to run when the page loads
  function handleAccessToken() {
    try {
      // Check if we have a hash with an access token
      if (window.location.hash && window.location.hash.includes('access_token=')) {
        console.log('Access token detected in URL hash');
        
        // Extract the hash without the # symbol
        const hashParams = window.location.hash.substring(1);
        
        // Store it in sessionStorage temporarily
        sessionStorage.setItem('supabase_auth_callback_params', hashParams);
        
        console.log('Access token stored in session storage for processing');
      }
    } catch (error) {
      console.error('Error handling access token:', error);
    }
  }
  
  // Run the function when the page loads
  if (document.readyState === 'complete') {
    handleAccessToken();
  } else {
    window.addEventListener('load', handleAccessToken);
  }
})();
