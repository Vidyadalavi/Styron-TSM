import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StyronAdminPanel from './AdminPanel';

export default function AdminPage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const authed = sessionStorage.getItem('admin_authed');

    if (!token || !authed) {
      navigate('/admin-login', { replace: true });
      return;
    }

    setChecking(false);
  }, [navigate]);

  if (checking) return null;

  return <StyronAdminPanel />;
}
