// Callback.jsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Callback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (code && window.opener) {
      window.opener.postMessage({ code }, '*');
      window.close();
    } else if (error) {
      alert('Login failed: ' + error);
      navigate('/');
    }
  }, [navigate, searchParams]);

  return <div className="p-4">Redirecting...</div>;
}
