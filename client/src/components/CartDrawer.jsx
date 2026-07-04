import { useCart } from '../CartContext';
import { useAuth } from '../AuthContext';
import CheckoutModal from './CheckoutModal';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer() {
  const { items, removeFromCart, updateQty, total, count, cartOpen, setCartOpen, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const handleCheckoutClick = () => {
    if (!user) {
      setCartOpen(false);
      navigate('/login', { state: { from: 'checkout' } });
      return;
    }
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  return (
    <>
      {/* Overlay */}
      {cartOpen && (
        <div
          onClick={() => setCartOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            zIndex: 300, backdropFilter: 'blur(2px)'
          }}
        />
      )}

      {/* Cart Drawer */}
      <div className={`cart-drawer ${cartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h3>🛒 Your Cart {count > 0 && <span className="cart-badge">{count}</span>}</h3>
          <button className="cart-close" onClick={() => setCartOpen(false)}>✕</button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
            <p>Your cart is empty</p>
            <p style={{ fontSize: '.8rem', color: 'var(--silver)', marginTop: '.5rem' }}>
              Add products from our catalogue below
            </p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map(item => (
                <div className="cart-item" key={item.id}>
                  <div className="cart-item-icon">{item.icon}</div>
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.title}</div>
                    <div className="cart-item-unit">{item.unit}</div>
                    <div className="cart-item-price">₹{(item.price * item.qty).toLocaleString('en-IN')}</div>
                  </div>
                  <div className="cart-item-controls">
                    <button className="qty-btn" onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                    <span className="qty-val">{item.qty}</span>
                    <button className="qty-btn" onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                  </div>
                  <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>✕</button>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-total">
                <span>Subtotal</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
              <p className="cart-note">* GST & delivery charges calculated at checkout</p>
              {!user && (
                <p className="cart-note" style={{ color: 'var(--gold)', fontWeight: 600 }}>
                  🔒 You'll need to log in before payment.
                </p>
              )}
              <button className="btn-checkout" onClick={handleCheckoutClick}>
                {user ? 'Proceed to Checkout →' : 'Log In to Checkout →'}
              </button>
              <button className="btn-clear" onClick={clearCart}>Clear Cart</button>
            </div>
          </>
        )}
      </div>

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={items}
        total={total}
        clearCart={clearCart}
      />
    </>
  );
}
