import React, { useEffect, useState } from 'react'
import '../../styles/NewProducts.css'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { HiOutlineTrash } from 'react-icons/hi'; // Delete icon ke liye

const UpdateProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productMainImg, setProductMainImg] = useState('');
    const [productCarouselImg1, setProductCarouselImg1] = useState('');
    const [productCarouselImg2, setProductCarouselImg2] = useState('');
    const [productCarouselImg3, setProductCarouselImg3] = useState('');
    const [productSizes, setProductSizes] = useState([]);
    const [productGender, setProductGender] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [productNewCategory, setProductNewCategory] = useState('');
    const [productPrice, setProductPrice] = useState(0);
    const [productDiscount, setProductDiscount] = useState(0);
    const [AvailableCategories, setAvailableCategories] = useState([]);

    useEffect(() => {
        fetchCategories();
        fetchProduct();
    }, [])

    const fetchProduct = async () => {
        try {
            const response = await axios.get(`http://localhost:6001/api/products/fetch-product-details/${id}`);
            setProductName(response.data.title);
            setProductDescription(response.data.description);
            setProductMainImg(response.data.mainImg);
            setProductCarouselImg1(response.data.carousel[0] || '');
            setProductCarouselImg2(response.data.carousel[1] || '');
            setProductCarouselImg3(response.data.carousel[2] || '');
            setProductSizes(response.data.sizes);
            setProductGender(response.data.gender);
            setProductCategory(response.data.category);
            setProductPrice(response.data.price);
            setProductDiscount(response.data.discount);
        } catch (err) { console.error(err); }
    }

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:6001/api/products/fetch-categories');
            setAvailableCategories(response.data);
        } catch (err) { console.error(err); }
    }

    // 🗑️ Category delete karne ka function
 const handleDeleteCategory = async () => {
    if (!productCategory || productCategory === "new category") {
        alert("Please select a valid category to delete!");
        return;
    }

    if (window.confirm(`Are you sure you want to delete "${productCategory}"?`)) {
        try {
            // Token nikalne ke liye
            const token = localStorage.getItem('token'); 
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            // Request ke saath config (headers) bhejein
            await axios.delete(
                `http://localhost:6001/api/products/delete-category/${productCategory}`, 
                config
            );

            alert("Category successfully deleted!");
            setProductCategory(''); 
            fetchCategories(); 
        } catch (err) {
            // Agar error aaye toh alert dikhayein
            alert("Failed to delete category! Check console for details.");
            console.error(err);
        }
    }
};

    const handleCheckBox = (e) => {
        const value = e.target.value;
        setProductSizes(e.target.checked ? [...productSizes, value] : productSizes.filter(size => size !== value));
    }

    const handleUpdateProduct = async () => {
        try {
            await axios.put(`http://localhost:6001/api/products/update-product/${id}`, {
                productName, productDescription, productMainImg,
                productCarousel: [productCarouselImg1, productCarouselImg2, productCarouselImg3],
                productSizes, productGender, productCategory, productNewCategory, productPrice, productDiscount
            });
            alert("Product successfully updated!");
            navigate('/all-products');
        } catch (err) { alert("Update failed!"); }
    }

    return (
        <div className="new-product-page">
            <div className="entry-card">
                <div className="entry-header">
                    <h3>Update <span>Inventory</span></h3>
                    <p>Modify the details for <b>{productName}</b></p>
                </div>

                <div className="entry-scroll-body">
                    <div className="entry-section">
                        <h6>Core Details</h6>
                        <div className="input-row">
                            <div className="modern-field">
                                <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} required />
                                <label>Product Name</label>
                            </div>
                            <div className="modern-field">
                                <input type="text" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} required />
                                <label>Description</label>
                            </div>
                        </div>
                    </div>

                    <div className="entry-section">
                        <h6>Images (URLs)</h6>
                        <div className="modern-field">
                            <input type="text" value={productMainImg} onChange={(e) => setProductMainImg(e.target.value)} required />
                            <label>Thumbnail / Main Image</label>
                        </div>
                        <div className="input-row-3">
                            <div className="modern-field"><input type="text" value={productCarouselImg1} onChange={(e) => setProductCarouselImg1(e.target.value)} /><label>Img 1</label></div>
                            <div className="modern-field"><input type="text" value={productCarouselImg2} onChange={(e) => setProductCarouselImg2(e.target.value)} /><label>Img 2</label></div>
                            <div className="modern-field"><input type="text" value={productCarouselImg3} onChange={(e) => setProductCarouselImg3(e.target.value)} /><label>Img 3</label></div>
                        </div>
                    </div>

                    <div className="entry-section split-view">
                        <div className="selection-block">
                            <h6>Size Matrix</h6>
                            <div className="check-grid">
                                {['S', 'M', 'L', 'XL'].map(sz => (
                                    <label key={sz} className="pill-check">
                                        <input type="checkbox" value={sz} checked={productSizes.includes(sz)} onChange={handleCheckBox} />
                                        <span>{sz}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="selection-block">
                            <h6>Gender</h6>
                            <div className="radio-grid">
                                {['Men', 'Women', 'Unisex'].map(g => (
                                    <label key={g} className="pill-radio">
                                        <input type="radio" name="gender" value={g} checked={productGender === g} onChange={(e) => setProductGender(e.target.value)} />
                                        <span>{g}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="entry-section">
                        <h6>Pricing & Category</h6>
                        <div className="input-row-3">
                            <div className="modern-field d-flex align-items-center gap-2">
                                <select 
                                    value={productCategory} 
                                    onChange={(e) => setProductCategory(e.target.value)}
                                    style={{ flex: 1 }}
                                >
                                    <option value="">Category</option>
                                    {AvailableCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    <option value="new category">+ New Category</option>
                                </select>
                                
                                {/* 🗑️ Delete Button: Sirf tab dikhega jab koi category select hogi */}
                                {productCategory && productCategory !== 'new category' && (
                                    <button 
                                        type="button"
                                        onClick={handleDeleteCategory}
                                        className="btn-delete-cat"
                                        title="Delete selected category"
                                        style={{ background: '#ff3e3e', color: 'white', border: 'none', borderRadius: '8px', padding: '10px', cursor: 'pointer' }}
                                    >
                                        <HiOutlineTrash />
                                    </button>
                                )}
                            </div>
                            <div className="modern-field"><input type="number" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} /><label>Price (₹)</label></div>
                            <div className="modern-field"><input type="number" value={productDiscount} onChange={(e) => setProductDiscount(e.target.value)} /><label>Discount %</label></div>
                        </div>
                        {productCategory === 'new category' && (
                            <div className="modern-field mt-3">
                                <input type="text" value={productNewCategory} onChange={(e) => setProductNewCategory(e.target.value)} />
                                <label>New Category Name</label>
                            </div>
                        )}
                    </div>
                </div>

                <button className="submit-entry-btn" onClick={handleUpdateProduct}>Update Product</button>
            </div>
        </div>
    )
}

export default UpdateProduct;