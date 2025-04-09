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

        // Parse the hash parameters
        const params = new URLSearchParams(hashParams);
        const accessToken = params.get('access_token');

        if (accessToken) {
          // Store the full hash in sessionStorage
          sessionStorage.setItem('supabase_auth_callback_params', hashParams);
          console.log('Access token stored in session storage for processing');

          // Also store individual parameters for easier access
          sessionStorage.setItem('supabase_access_token', accessToken);

          const refreshToken = params.get('refresh_token');
          if (refreshToken) {
            sessionStorage.setItem('supabase_refresh_token', refreshToken);
          }

          const expiresIn = params.get('expires_in');
          if (expiresIn) {
            sessionStorage.setItem('supabase_expires_in', expiresIn);
          }

          const tokenType = params.get('token_type');
          if (tokenType) {
            sessionStorage.setItem('supabase_token_type', tokenType);
          }

          // Create a custom event to notify the application that we have the token
          const event = new CustomEvent('supabase_auth_token_ready', {
            detail: { accessToken }
          });
          window.dispatchEvent(event);
        }
      }
    } catch (error) {
      console.error('Error handling access token:', error);
    }
  }

  // Run the function immediately
  handleAccessToken();

  // Also run when the page fully loads to be safe
  if (document.readyState !== 'complete') {
    window.addEventListener('load', handleAccessToken);
  }
})();
