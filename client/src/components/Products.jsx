import React, { useEffect, useState, useContext } from 'react' // useContext add kiya
import '../styles/Products.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GeneralContext } from '../context/GeneralContext'; // Context import kiya

const Products = (props) => {
    const navigate = useNavigate();
    
    // Global search query access kiya
    const { searchQuery } = useContext(GeneralContext);

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [visibleProducts, setVisibleProducts] = useState([]);

    useEffect(() => {
        fetchData();
    }, [props.category]); 

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:6001/api/products/fetch-products');
            const allProducts = response.data;
            
            let initialFiltered = [];
            if (props.category === 'all' || !props.category) {
                initialFiltered = allProducts;
            } else {
                initialFiltered = allProducts.filter(p => 
                    p.category.toLowerCase() === props.category.toLowerCase()
                );
            }
            
            setProducts(initialFiltered);
            setVisibleProducts(initialFiltered);

            const catRes = await axios.get('http://localhost:6001/api/products/fetch-categories');
            setCategories(catRes.data);
        } catch (err) {
            console.error("Error fetching data:", err);
        }
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

    // Advanced Filtering logic including Search Query
    useEffect(() => {
        let refined = products;

        // 1. Search Filter: Title aur Category dono check karta hai
        if (searchQuery) {
            refined = refined.filter(p => 
                p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                p.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // 2. Sidebar Category Filter
        if (categoryFilter.length > 0) {
            refined = refined.filter(p => categoryFilter.includes(p.category));
        }

        // 3. Gender Filter
        if (genderFilter.length > 0) {
            refined = refined.filter(p => genderFilter.includes(p.gender));
        }

        setVisibleProducts(refined);
    }, [searchQuery, categoryFilter, genderFilter, products])

    return (
        <div className="products-view-container">
            <aside className="filter-sidebar">
                <div className="filter-header">
                    <h4>Refine By</h4>
                </div>

                <div className="filter-group">
                    <h6>Sort By</h6>
                    <div className="filter-options">
                        {['Popular', 'Price (low to high)', 'Price (high to low)', 'Discount'].map((label, idx) => {
                            const val = ['popularity', 'low-price', 'high-price', 'discount'][idx];
                            return (
                                <label key={val} className="radio-custom">
                                    <input type="radio" name="sort" value={val} checked={sortFilter === val} onChange={handleSortFilterChange} />
                                    <span>{label}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>

                {(props.category === 'all' || !props.category) && (
                    <div className="filter-group">
                        <h6>Categories</h6>
                        <div className="filter-options">
                            {categories.map(cat => (
                                <label key={cat} className="checkbox-custom">
                                    <input type="checkbox" value={cat} checked={categoryFilter.includes(cat)} onChange={handleCategoryCheckBox} />
                                    <span>{cat}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                <div className="filter-group">
                    <h6>Gender</h6>
                    <div className="filter-options">
                        {['Men', 'Women', 'Unisex'].map(g => (
                            <label key={g} className="checkbox-custom">
                                <input type="checkbox" value={g} checked={genderFilter.includes(g)} onChange={handleGenderCheckBox} />
                                <span>{g}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </aside>

            <main className="products-main-content">
                <div className="content-header">
                    <h3>Explore {props.category !== 'all' ? props.category : ''} Products <span>({visibleProducts.length})</span></h3>
                </div>
                
                <div className="products-grid-modern">
                    {visibleProducts.length > 0 ? (
                        visibleProducts.map((product) => (
                            <div className="modern-product-card" key={product._id} onClick={() => navigate(`/product/${product._id}`)}>
                                <div className="image-holder">
                                    <img src={product.mainImg} alt={product.title} />
                                    {product.discount > 10 && <span className="badge-sale">-{product.discount}%</span>}
                                </div>
                                <div className="info-holder">
                                    <h6>{product.title}</h6>
                                    <p className="desc-text">{product.description.slice(0, 45)}...</p>
                                    <div className="pricing-info">
                                        <span className="final-price">₹{parseInt(product.price - (product.price * product.discount) / 100)}</span>
                                        <span className="orig-price">₹{product.price}</span>
                                    </div>
                                    <button className="view-btn">View Product</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-data-msg">No results found for your search.</div>
                    )}
                </div>
            </main>
        </div>
    )
}

export default Products;