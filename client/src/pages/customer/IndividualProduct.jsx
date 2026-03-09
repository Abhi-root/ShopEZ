import React, { useContext, useEffect, useState } from 'react'
import '../../styles/IndividualProduct.css'
import { HiOutlineArrowNarrowLeft, HiOutlineShoppingBag, HiLightningBolt } from 'react-icons/hi'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { GeneralContext } from '../../context/GeneralContext';

const IndividualProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const { fetchCartCount } = useContext(GeneralContext);

    // Product Data State
    const [product, setProduct] = useState({
        title: '', description: '', mainImg: '', carousel: [], sizes: [], price: 0, discount: 0
    });

    // Order/Cart States
    const [productQuantity, setProductQuantity] = useState(1);
    const [size, setSize] = useState('');

    // Checkout Form States
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [pincode, setPincode] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');

    useEffect(() => { 
        fetchProduct(); 
    }, [id]);

    const fetchProduct = async () => {
        try {
            const res = await axios.get(`https://shop-ez-flame.vercel.app/api/products/fetch-product-details/${id}`);
            setProduct({
                ...res.data,
                carousel: res.data.carousel || []
            });
        } catch (err) { console.error("Error fetching product:", err); }
    }

    const buyNow = async () => {
        const token = localStorage.getItem("token");

        // Validation: Ensure all fields are filled
        if (!size || !name || !address || !mobile || !paymentMethod) {
            alert("Please select a size and fill all checkout details!");
            return;
        }

        try {
            await axios.post(
                'https://shop-ez-flame.vercel.app/api/orders/buy-product',
                {
                    userId, name, email, mobile, address, pincode,
                    title: product.title, description: product.description,
                    mainImg: product.mainImg, size, quantity: productQuantity,
                    price: product.price, discount: product.discount,
                    paymentMethod, orderDate: new Date()
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Manual Modal Close to prevent "classList of undefined" error
            const modalElement = document.getElementById('staticBackdrop');
            const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) modalInstance.hide();

            // Cleanup Backdrop
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) backdrop.remove();

            alert('Order placed successfully!!');
            navigate('/profile');
        } catch (err) {
            console.error("Order error:", err);
            alert(err.response?.data?.message || "Order failed!!");
        }
    }

    const handleAddToCart = async () => {
        if (!size) return alert("Please select a size");
        try {
            await axios.post('https://shop-ez-flame.vercel.app/api/cart/add-to-cart', { 
                userId, title: product.title, description: product.description, 
                mainImg: product.mainImg, size, quantity: productQuantity, 
                price: product.price, discount: product.discount 
            });
            alert("Product added to bag!!");
            navigate('/cart');
        } catch (err) { alert("Operation failed!!"); }
    }

    return (
        <div className="product-view-wrapper">
            <div className="back-nav" onClick={() => navigate('/')}>
                <HiOutlineArrowNarrowLeft /> <span>Back to Catalog</span>
            </div>

            <div className="product-main-grid">
                {/* Left: Image Gallery */}
                <div className="product-gallery">
                    <div id="productCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <img src={product.mainImg} className="d-block w-100" alt="main" />
                            </div>
                            {product.carousel.map((img, idx) => (
                                <div className="carousel-item" key={idx}>
                                    <img src={img} className="d-block w-100" alt={`carousel-${idx}`} />
                                </div>
                            ))}
                        </div>
                        <button className="carousel-control-prev" data-bs-target="#productCarousel" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon"></span>
                        </button>
                        <button className="carousel-control-next" data-bs-target="#productCarousel" data-bs-slide="next">
                            <span className="carousel-control-next-icon"></span>
                        </button>
                    </div>
                </div>

                {/* Right: Product Details */}
                <div className="product-details-content">
                    <p className="product-brand-pill">ShopEZ Original</p>
                    <h1 className="product-title">{product.title}</h1>
                    <p className="product-desc">{product.description}</p>

                    <div className="price-container">
                        <span className="curr-price">₹{parseInt(product.price - (product.price * product.discount) / 100)}</span>
                        <span className="old-price">₹{product.price}</span>
                        <span className="discount-badge">{product.discount}% OFF</span>
                    </div>

                    <div className="selection-area">
                        <div className="select-group">
                            <label>Select Size</label>
                            <div className="size-options">
                                {product.sizes.map(s => (
                                    <button key={s} className={size === s ? 'active' : ''} onClick={() => setSize(s)}>{s}</button>
                                ))}
                            </div>
                        </div>

                        <div className="select-group">
                            <label>Quantity</label>
                            <select className="qty-select" value={productQuantity} onChange={(e) => setProductQuantity(e.target.value)}>
                                {[1, 2, 3, 4, 5].map(q => <option key={q} value={q}>{q}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="action-buttons-row">
                        <button className="btn-buy" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                            <HiLightningBolt /> Buy Now
                        </button>
                        <button className="btn-cart" onClick={handleAddToCart}>
                            <HiOutlineShoppingBag /> Add to Bag
                        </button>
                    </div>
                </div>
            </div>

            {/* Checkout Modal */}
            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content checkout-modal">
                        <div className="modal-header border-0">
                            <h5 className="modal-title">Checkout Details</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <div className="modern-field">
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" required />
                            </div>
                            <div className="row-inputs">
                                <input className="modern-field" type="text" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Mobile Number" />
                                <input className="modern-field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" />
                            </div>
                            <input className="modern-field" type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Full Address" />
                            <input className="modern-field" type="text" value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="Pincode" />
                            <select className="modern-field" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                <option value="">Choose Payment Method</option>
                                <option value="cod">Cash on Delivery</option>
                                <option value="upi">UPI / Online</option>
                            </select>
                        </div>
                        <div className="modal-footer border-0">
                            <button className="place-order-final" onClick={buyNow}>Confirm & Place Order</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default IndividualProduct;