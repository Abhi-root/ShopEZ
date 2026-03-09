import React, { useEffect, useState } from 'react'
import '../../styles/AllProducts.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AllProducts = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [visibleProducts, setVisibleProducts] = useState([]);

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        const prodRes = await axios.get('https://shop-ez-flame.vercel.app/api/products/fetch-products');
        setProducts(prodRes.data);
        setVisibleProducts(prodRes.data);

        const catRes = await axios.get('https://shop-ez-flame.vercel.app/api/products/fetch-categories');
        setCategories(catRes.data);
    }

    const [sortFilter, setSortFilter] = useState('popularity');
    const [categoryFilter, setCategoryFilter] = useState([]);
    const [genderFilter, setGenderFilter] = useState([]);

    const handleCategoryCheckBox = (e) => {
        const value = e.target.value;
        setCategoryFilter(e.target.checked ? [...categoryFilter, value] : categoryFilter.filter(c => c !== value));
    }

    const handleGenderCheckBox = (e) => {
        const value = e.target.value;
        setGenderFilter(e.target.checked ? [...genderFilter, value] : genderFilter.filter(g => g !== value));
    }

    const handleSortFilterChange = (e) => {
        const value = e.target.value;
        setSortFilter(value);
        let sorted = [...visibleProducts];
        if (value === 'low-price') sorted.sort((a, b) => a.price - b.price);
        else if (value === 'high-price') sorted.sort((a, b) => b.price - a.price);
        else if (value === 'discount') sorted.sort((a, b) => b.discount - a.discount);
        setVisibleProducts(sorted);
    }

    useEffect(() => {
        let filtered = products;
        if (categoryFilter.length > 0) filtered = filtered.filter(p => categoryFilter.includes(p.category));
        if (genderFilter.length > 0) filtered = filtered.filter(p => genderFilter.includes(p.gender));
        setVisibleProducts(filtered);
    }, [categoryFilter, genderFilter, products])

    return (
        <div className="admin-inventory-page">
            <div className="inventory-header">
                <h3>Inventory <span>Management</span></h3>
                <button className="add-new-btn" onClick={() => navigate('/new-product')}>+ Add Product</button>
            </div>

            <div className="inventory-container">
                <aside className="inventory-sidebar">
                    <div className="filter-box">
                        <h6>Sort Strategy</h6>
                        <div className="option-list">
                            {['popularity', 'low-price', 'high-price', 'discount'].map((val) => (
                                <label key={val} className="custom-radio">
                                    <input type="radio" name="sort" value={val} checked={sortFilter === val} onChange={handleSortFilterChange} />
                                    <span>{val.replace('-', ' ')}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="filter-box">
                        <h6>Categories</h6>
                        <div className="option-list scrollable">
                            {categories.map(cat => (
                                <label key={cat} className="custom-check">
                                    <input type="checkbox" value={cat} checked={categoryFilter.includes(cat)} onChange={handleCategoryCheckBox} />
                                    <span>{cat}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="filter-box">
                        <h6>Gender Group</h6>
                        <div className="option-list">
                            {['Men', 'Women', 'Unisex'].map(g => (
                                <label key={g} className="custom-check">
                                    <input type="checkbox" value={g} checked={genderFilter.includes(g)} onChange={handleGenderCheckBox} />
                                    <span>{g}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </aside>

                <main className="inventory-grid-container">
                    <div className="inventory-grid">
                        {visibleProducts.map((product) => (
                            <div className="inventory-card" key={product._id}>
                                <div className="card-img-holder">
                                    <img src={product.mainImg} alt="" />
                                    <div className="card-badge">{product.category}</div>
                                </div>
                                <div className="card-content">
                                    <h6>{product.title}</h6>
                                    <div className="card-pricing">
                                        <span className="price-now">₹{parseInt(product.price - (product.price * product.discount) / 100)}</span>
                                        <span className="price-was">₹{product.price}</span>
                                        <span className="price-off">{product.discount}% OFF</span>
                                    </div>
                                    <button className="update-stock-btn" onClick={() => navigate(`/update-product/${product._id}`)}>
                                        Edit Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default AllProducts