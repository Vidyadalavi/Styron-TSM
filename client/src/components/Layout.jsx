import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingWidgets from './FloatingWidgets';
import CartDrawer from './CartDrawer';

export default function Layout() {
  return (
    <>
      <TopBar />
      <Navbar />
      <main className="page-content">
        <Outlet />
      </main>
      <Footer />
      <FloatingWidgets />
      <CartDrawer />
    </>
  );
}
