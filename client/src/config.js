// Centralized API base URL.
// In production (Render), set VITE_API_URL in the frontend service's
// Environment tab to your backend's URL, e.g.
//   VITE_API_URL=https://styron-backend-wsnz.onrender.com
// Vite bakes this in at BUILD time, so you must trigger a fresh deploy
// after adding/changing this variable — just saving it is not enough.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
