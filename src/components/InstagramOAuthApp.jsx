import { useState, useEffect } from 'react';
const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;
const redirectUri = import.meta.env.VITE_REDIRECT_URI;

export default function InstagramOAuthApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Instagram OAuth configuration

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

  // Exchange auth code for access token
  const exchangeCodeForToken = async (code) => {
    try {
      setIsLoading(true);

      // This should ideally be done on a backend for security
      const response = await fetch(
        'https://api.instagram.com/oauth/access_token',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'authorization_code',
            redirect_uri: redirectUri,
            code: code,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to exchange code: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      setErrorMessage(`Failed to exchange auth code: ${error.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user profile information
  const fetchUserProfile = async (accessToken) => {
    try {
      setIsLoading(true);

      // Get user ID first
      const meResponse = await fetch(
        `https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`
      );

      if (!meResponse.ok) {
        throw new Error(`Failed to fetch user data: ${meResponse.status}`);
      }

      const meData = await meResponse.json();

      // Get more detailed profile data
      const profileResponse = await fetch(
        `https://graph.instagram.com/${meData.id}?fields=id,username,account_type,media_count&access_token=${accessToken}`
      );

      if (!profileResponse.ok) {
        throw new Error(`Failed to fetch profile: ${profileResponse.status}`);
      }

      const profile = await profileResponse.json();
      return profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setErrorMessage(`Failed to fetch profile: ${error.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is already logged in (data in localStorage)
    const storedAuthData = localStorage.getItem('instagramAuthData');

    if (storedAuthData) {
      try {
        const parsedData = JSON.parse(storedAuthData);
        setUserData(parsedData);
        setIsLoggedIn(true);

        // If we have an access token, fetch profile
        if (parsedData.accessToken) {
          fetchUserProfile(parsedData.accessToken).then((profile) => {
            if (profile) {
              setProfileData(profile);

              // Update stored data with profile
              const updatedData = { ...parsedData, profile };
              localStorage.setItem(
                'instagramAuthData',
                JSON.stringify(updatedData)
              );
            }
          });
        }
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
      // Process the auth code and exchange for token
      exchangeCodeForToken(authCode)
        .then((tokenData) => {
          if (tokenData && tokenData.access_token) {
            // Store token data
            const authData = {
              authCode,
              accessToken: tokenData.access_token,
              userId: tokenData.user_id,
              timestamp: new Date().toISOString(),
            };

            localStorage.setItem('instagramAuthData', JSON.stringify(authData));
            setUserData(authData);
            setIsLoggedIn(true);

            // Fetch user profile with the new token
            return fetchUserProfile(tokenData.access_token);
          }
          return null;
        })
        .then((profile) => {
          if (profile) {
            setProfileData(profile);

            // Update stored data with profile
            const currentData = JSON.parse(
              localStorage.getItem('instagramAuthData')
            );
            const updatedData = { ...currentData, profile };
            localStorage.setItem(
              'instagramAuthData',
              JSON.stringify(updatedData)
            );
          }
        });

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
    setProfileData(null);
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

        {isLoading && (
          <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded">
            Loading data from Instagram...
          </div>
        )}

        {isLoggedIn ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-100 text-green-700 rounded">
              <p className="font-medium">
                Successfully connected to Instagram!
              </p>
            </div>

            {profileData && (
              <div className="bg-white p-4 rounded border border-gray-200">
                <h2 className="text-lg font-medium mb-3">
                  Profile Information
                </h2>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Username:</span> @
                    {profileData.username}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">User ID:</span>{' '}
                    {profileData.id}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Account Type:</span>{' '}
                    {profileData.account_type}
                  </p>
                  {profileData.media_count !== undefined && (
                    <p className="text-sm">
                      <span className="font-medium">Media Count:</span>{' '}
                      {profileData.media_count}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <h2 className="text-lg font-medium mb-2">
                Authorization Details
              </h2>
              <p className="text-sm mb-1">
                <span className="font-medium">Auth Code:</span>{' '}
                {userData?.authCode && userData.authCode.substring(0, 8)}...
              </p>
              {userData?.accessToken && (
                <p className="text-sm mb-1">
                  <span className="font-medium">Access Token:</span>{' '}
                  {userData.accessToken.substring(0, 8)}...
                </p>
              )}
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
