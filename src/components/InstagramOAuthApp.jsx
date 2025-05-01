import { useState, useEffect } from 'react';

export default function InstagramOAuthApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Instagram OAuth configuration
  const clientId = '601308162937702';
  const redirectUri = 'https://instabot.pages.dev/';
  const scopes = [
    'instagram_business_basic',
    'instagram_business_manage_messages',
    'instagram_business_manage_comments',
    'instagram_business_content_publish',
  ];

  // Create the OAuth URL
  const authUrl = `https://www.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=${encodeURIComponent(scopes.join(','))}`;

  useEffect(() => {
    // Check if user is already logged in (data in localStorage)
    const storedAuthData = localStorage.getItem('instagramAuthData');

    if (storedAuthData) {
      try {
        const parsedData = JSON.parse(storedAuthData);
        setUserData(parsedData);
        setIsLoggedIn(true);
      } catch (err) {
        console.error('Error parsing stored auth data:', err);
        localStorage.removeItem('instagramAuthData');
      }
    }

    // Check for authorization code in URL when redirected back from Instagram
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code');
    const error = urlParams.get('error');

    if (authCode) {
      // Store the auth code in localStorage
      const authData = {
        authCode,
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem('instagramAuthData', JSON.stringify(authData));
      setUserData(authData);
      setIsLoggedIn(true);

      // Remove code from URL to prevent issues on refresh
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (error) {
      setErrorMessage(`Authentication failed: ${error}`);
      console.error('Instagram OAuth error:', error);
    }
  }, []);

  const handleLogin = () => {
    // Redirect to Instagram authorization page
    window.location.href = authUrl;
  };

  const handleLogout = () => {
    // Clear stored data and reset state
    localStorage.removeItem('instagramAuthData');
    setIsLoggedIn(false);
    setUserData(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Instagram Integration
          </h1>
          <p className="text-gray-600">Connect with Instagram Business API</p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {errorMessage}
          </div>
        )}

        {isLoggedIn ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-100 text-green-700 rounded">
              <p className="font-medium">
                Successfully connected to Instagram!
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <h2 className="text-lg font-medium mb-2">
                Authorization Details
              </h2>
              <p className="text-sm mb-1">
                <span className="font-medium">Auth Code:</span>{' '}
                {userData?.authCode.substring(0, 8)}...
              </p>
              <p className="text-sm">
                <span className="font-medium">Timestamp:</span>{' '}
                {userData?.timestamp}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <h2 className="text-lg font-medium mb-2">Granted Permissions</h2>
              <ul className="text-sm space-y-1">
                {scopes.map((scope, index) => (
                  <li key={index} className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    {scope.replace(/_/g, ' ')}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded transition duration-200">
              Disconnect Instagram
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 text-blue-700 rounded">
              <p>
                Connect your Instagram Business account to manage content and
                messages.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <h2 className="text-lg font-medium mb-2">
                You will grant permissions for:
              </h2>
              <ul className="text-sm space-y-1">
                {scopes.map((scope, index) => (
                  <li key={index} className="flex items-center">
                    <span className="mr-2 text-gray-400">○</span>
                    {scope.replace(/_/g, ' ')}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={handleLogin}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition duration-200 flex items-center justify-center">
              <span className="mr-2">Connect with Instagram</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
