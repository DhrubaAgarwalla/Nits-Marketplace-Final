// This script directly handles authentication in the callback page
// It's a more direct approach that doesn't rely on the Next.js framework

(function() {
  async function handleAuth() {
    try {
      console.log('Direct auth handler running');
      
      // Check if we have a hash with an access token
      if (window.location.hash && window.location.hash.includes('access_token=')) {
        console.log('Access token detected in URL hash by direct handler');
        
        // Extract the hash without the # symbol
        const hashParams = window.location.hash.substring(1);
        
        // Parse the hash parameters
        const params = new URLSearchParams(hashParams);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        
        if (accessToken) {
          console.log('Access token found, attempting direct authentication');
          
          // Create a Supabase client directly
          const { createClient } = supabaseJs;
          const supabaseUrl = window.SUPABASE_URL || 'https://uhbslznabvkxrrkgeyaq.supabase.co';
          const supabaseKey = window.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoYnNsem5hYnZreHJya2dleWFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI2NTI1NzYsImV4cCI6MjAyODIyODU3Nn0.Nh83ebqzf9Yt_1oJjHLSNnr-S_qHQwj_2Vj6zxq3C8E';
          
          const supabase = createClient(supabaseUrl, supabaseKey);
          
          try {
            // Try to set the session directly
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || ''
            });
            
            if (error) {
              throw error;
            }
            
            console.log('Session set successfully via direct handler');
            
            // Redirect to home page
            setTimeout(() => {
              window.location.href = '/';
            }, 1000);
            
            return;
          } catch (err) {
            console.error('Error setting session in direct handler:', err);
            
            // Try a different approach - just reload without the hash
            const cleanUrl = window.location.href.split('#')[0];
            window.location.href = cleanUrl;
          }
        }
      }
    } catch (error) {
      console.error('Error in direct auth handler:', error);
    }
  }
  
  // Load Supabase JS from CDN if not already available
  if (typeof supabaseJs === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.onload = handleAuth;
    document.head.appendChild(script);
  } else {
    handleAuth();
  }
})();
