import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// Read saved user on first load
function getSavedUser() {
  try {
    const raw = localStorage.getItem('styron_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getSavedUser);

  const login = (name, email) => {
    const newUser = {
      name:    name  || 'Guest User',
      email:   email || '',
      initial: (name || 'G').trim().charAt(0).toUpperCase(),
    };
    setUser(newUser);
    // persist so refresh keeps them logged in
    localStorage.setItem('styron_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('styron_user');
    localStorage.removeItem('styron_token');
    localStorage.removeItem('styron_email');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);