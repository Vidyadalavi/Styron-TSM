import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './CartContext';
import { AuthProvider } from './AuthContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import EstimatorPage from './pages/EstimatorPage';
import QuotationPage from './pages/QuotationPage';
import TrackPage from './pages/TrackPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import ProductPage from './pages/Product';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminPage from './pages/AdminPage';



export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/estimator" element={<EstimatorPage />} />
            <Route path="/quotation" element={<QuotationPage />} />
            <Route path="/track" element={<TrackPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
           <Route path="/login" element={<LoginPage />} />
          </Route>

          {/* Admin routes — completely separate, no site navbar/footer */}
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}
