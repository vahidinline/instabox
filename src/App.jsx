// // App.jsx
// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const APP_ID = '601308162937702';
// const REDIRECT_URI = 'https://instabot.pages.dev/callback';
// const SCOPES = [
//   'instagram_business_basic',
//   'instagram_business_manage_messages',
//   'instagram_business_manage_comments',
//   'instagram_business_content_publish',
// ].join(',');

// const AUTH_URL = `https://www.instagram.com/oauth/authorize?client_id=${APP_ID}&redirect_uri=${encodeURIComponent(
//   REDIRECT_URI
// )}&response_type=code&scope=${SCOPES}`;
// const savedCode = localStorage.getItem('ig_auth_code');

// export default function App() {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleMessage = (event) => {
//       if (event.data?.code) {
//         localStorage.setItem('ig_auth_code', event.data.code);
//         alert('Instagram login successful! Code saved.');
//         navigate('/');
//       }
//     };

//     window.addEventListener('message', handleMessage);
//     return () => window.removeEventListener('message', handleMessage);
//   }, [navigate]);

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Login with Instagram Business</h1>
//       <button
//         onClick={() => {
//           window.open(
//             AUTH_URL,
//             '_blank',
//             'width=600,height=700,menubar=no,toolbar=no,location=no,status=no'
//           );
//         }}
//         className="px-4 py-2 bg-blue-600 text-white rounded">
//         Login with Instagram {APP_ID}
//       </button>

//       {savedCode && (
//         <div className="mt-4 p-4 bg-green-100 rounded">
//           <p className="text-green-800 font-medium">Auth Code:</p>
//           <code className="text-green-900">{savedCode}</code>
//         </div>
//       )}
//     </div>
//   );
// }

import InstagramOAuthApp from './components/InstagramOAuthApp';
import './App.css';

function App() {
  return (
    <div className="App">
      <InstagramOAuthApp />
    </div>
  );
}
export default App;
