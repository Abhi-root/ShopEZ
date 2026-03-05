import React, { useContext, useEffect, useState } from 'react';
import { HiOutlineTrash, HiOutlineShoppingBag } from 'react-icons/hi';
import { GeneralContext } from '../../context/GeneralContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/Cart.css';

const Cart = () => {
  const { cartCount, setCartCount } = useContext(GeneralContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [deliveryCharges, setDeliveryCharges] = useState(0);

  const [formData, setFormData] = useState({
    name: '', mobile: '', email: '', address: '', pincode: '', paymentMethod: ''
  });

  const fetchCart = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      const response = await axios.get('http://localhost:6001/api/cart/fetch-cart', config);
      const items = Array.isArray(response.data) ? response.data : [];
      setCartItems(items);
      const count = items.reduce((acc, item) => acc + (parseInt(item.quantity) || 0), 0);
      setCartCount(count);
    } catch (error) {
      setCartItems([]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchCart(); }, []);

  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = cartItems.reduce((sum, item) => sum + ((item.price * item.discount) / 100) * item.quantity, 0);
    setTotalPrice(total);
    setTotalDiscount(Math.floor(discount));
    setDeliveryCharges(total > 1000 || cartItems.length === 0 ? 0 : 50);
  }, [cartItems]);

  const removeItem = async (itemId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      await axios.delete(`http://localhost:6001/api/cart/remove-item/${itemId}`, config);
      fetchCart();
    } catch (err) { console.error(err); }
  };

  const placeOrder = async () => {
    if (cartItems.length === 0) return;
    try {
      await axios.post('http://localhost:6001/api/orders/place-cart-order', {
        ...formData,
        userId: localStorage.getItem('userId'),
        orderDate: new Date(),
      });

      const modalElement = document.getElementById('checkoutModal');
      const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) modalInstance.hide();

      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
      }

      alert('Order placed successfully!');
      navigate('/profile');
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  if (loading) return <div className="loader-container">Loading your bag...</div>;

  return (
    <div className="modern-cart-container">
      <div className="cart-layout">
        <div className="cart-items-section">
          <div className="cart-header">
            <h3>Shopping Bag <span>({cartItems.length} items)</span></h3>
          </div>

          {cartItems.length === 0 ? (
            <div className="empty-cart-premium">
              <div className="empty-cart-icon-wrapper">
                <HiOutlineShoppingBag size={60} />
              </div>
              <h4>Your bag is empty!</h4>
              <p>Looks like you haven't added anything to your cart yet.</p>
              
              {/* ✅ Redirects to Home Page now */}
              <button className="start-shopping-btn" onClick={() => navigate('/')}>
                Start Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div className="modern-cart-item" key={item._id}>
                <div className="item-img-container">
                  <img src={item.mainImg} alt={item.title} />
                </div>
                <div className="item-details">
                  <div className="item-top">
                    <h4>{item.title}</h4>
                    <HiOutlineTrash className="remove-icon" onClick={() => removeItem(item._id)} />
                  </div>
                  <p className="item-desc">{item.description.slice(0, 60)}...</p>
                  <div className="item-meta">
                    <span>Size: <b>{item.size}</b></span>
                    <span>Qty: <b>{item.quantity}</b></span>
                  </div>
                  <h5 className="item-price">
                    ₹{parseInt(item.price - (item.price * item.discount) / 100) * item.quantity}
                  </h5>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-summary-section">
          <div className="summary-card">
            <h4>Price Summary</h4>
            <div className="price-row">
              <span>Total MRP</span>
              <span>₹{totalPrice}</span>
            </div>
            <div className="price-row">
              <span>Bag Discount</span>
              <span className="discount-text">- ₹{totalDiscount}</span>
            </div>
            <div className="price-row">
              <span>Delivery Fee</span>
              <span className={deliveryCharges === 0 ? "free-text" : ""}>
                {deliveryCharges === 0 ? "FREE" : `+ ₹${deliveryCharges}`}
              </span>
            </div>
            <hr />
            <div className="price-row total-row">
              <span>Total Amount</span>
              <span>₹{totalPrice - totalDiscount + deliveryCharges}</span>
            </div>
            <button className="checkout-btn" data-bs-toggle="modal" data-bs-target="#checkoutModal">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

      <div className="modal fade" id="checkoutModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content checkout-modal">
            <div className="modal-header border-0">
              <h5 className="modal-title">Delivery Details</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <input className="modern-input" type="text" placeholder="Full Name" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              <div className="row-inputs">
                <input className="modern-input" type="text" placeholder="Mobile" onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} />
                <input className="modern-input" type="email" placeholder="Email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <input className="modern-input" type="text" placeholder="Address" onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
              <input className="modern-input" type="text" placeholder="Pincode" onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} />
              <select className="modern-input" onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}>
                <option value="">Choose Payment</option>
                <option value="cod">Cash on Delivery</option>
                <option value="upi">UPI / Online</option>
              </select>
            </div>
            <div className="modal-footer border-0">
              <button type="button" className="place-order-final" onClick={placeOrder}>
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;