import React, { useContext, useEffect,useState } from 'react'
import { HiOutlineSearch, HiOutlineShoppingBag } from 'react-icons/hi'
import { RiUserSharedLine, RiShutDownLine } from 'react-icons/ri'
import '../styles/Navbar.css'
import { useNavigate } from 'react-router-dom'
import { GeneralContext } from '../context/GeneralContext'
import axios from 'axios'

const Navbar = () => {
  const navigate = useNavigate();
  const usertype = localStorage.getItem('userType');
  const username = localStorage.getItem('username');
  
  
  const { cartCount, logout, setSearchQuery } = useContext(GeneralContext);

  const [productSearch, setProductSearch] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://shopez-2-6e3z.onrender.com/api/products/fetch-categories');
        setCategories(response.data);
      } catch (err) { console.log(err); }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setProductSearch(query);
    setSearchQuery(query); 
  };

  const executeSearch = () => {
  
    const matchedCategory = categories.find(cat => cat.toLowerCase() === productSearch.toLowerCase());
    
    if (matchedCategory) {
      navigate(`/category/${matchedCategory}`);
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <nav className="float-nav">
        <div className="nav-pill-container">
          <div className="nav-brand-bold" onClick={() => navigate('/')}>S<span>EZ</span></div>

          {usertype !== 'admin' && (
            <div className="nav-pill-search">
              <input 
                type="text" 
                placeholder='Search electronics, sports, fashion...' 
                value={productSearch}
                onChange={handleSearch} 
                onKeyDown={(e) => e.key === 'Enter' && executeSearch()} 
              />
              <HiOutlineSearch className="pill-search-icon" onClick={executeSearch} />
            </div>
          )}

          <div className="nav-pill-actions">
            {!usertype ? (
              <button className='pill-login-btn' onClick={() => navigate('/auth')}>SIGN IN</button>
            ) : usertype === 'customer' ? (
              <>
                <div className="pill-action-item" onClick={() => navigate('/profile')}>
                  <RiUserSharedLine className='pill-icon' />
                  <span className="pill-user-name">{username?.split(' ')[0]}</span>
                </div>
                <div className="pill-action-item" onClick={() => navigate('/cart')}>
                  <div className="pill-cart-wrapper">
                    <HiOutlineShoppingBag className='pill-icon' />
                    {cartCount > 0 && <span className="pill-cart-badge">{cartCount}</span>}
                  </div>
                </div>
              </>
            ) : (
              <div className="admin-pill-group">
                <span onClick={() => navigate('/admin')}>HOME</span>
                <span onClick={() => navigate('/all-products')}>PRODUCTS</span>
                <RiShutDownLine className="pill-logout-icon" onClick={logout} />
              </div>
            )}
          </div>
        </div>
      </nav>
      <div className="nav-pill-spacer"></div>
    </>
  );
}

export default Navbar;