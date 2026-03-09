import React, { useEffect, useState } from 'react'
import '../styles/Home.css'
import Products from '../components/Products'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Home = () => {
  const navigate = useNavigate();
  // Image URL ke liye null state
  const [bannerImg, setBannerImg] = useState(null);

  useEffect(() => {
    fetchBanner();
  }, [])

  const fetchBanner = async () => {
    try {
      const response = await axios.get("https://shop-ez-flame.vercel.app/api/banners");
      // Check karein ki array mein data hai ya nahi
      if (response.data && response.data.length > 0) {
        // Sirf pehle banner ka URL extract karein
        setBannerImg(response.data[0].bannerUrl);
      }
    } catch (err) {
      console.error("Failed to fetch banner:", err.message);
    }
  };

  const categories = [
    { name: 'Fashion', path: 'Fashion', img: 'https://tse3.mm.bing.net/th/id/OIP.ORH_mwC_R1rP2xGViNy_lwHaE8?pid=Api&P=0&h=180' },
    { name: 'Electronics', path: 'Electronics', img: 'https://5.imimg.com/data5/ANDROID/Default/2023/1/SE/QC/NG/63182719/product-jpeg-500x500.jpg' },
    { name: 'Mobiles', path: 'mobiles', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3jUW7v1WFJL9Ylax9a4vazyKXwG-ktSinI4Rd7qi7MkhMr79UlIyyrNkbiK0Cz5u6WYw&usqp=CAU' },
    { name: 'Groceries', path: 'Groceries', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXbpV_yQ_zCtZt_1kNebjvFqXvdDnLuuJPsQ&usqp=CAU' },
    { name: 'Sports', path: 'Sports-Equipment', img: 'https://a.storyblok.com/f/112937/568x464/82f66c3a21/all_the_english-_football_terms_you_need_to_know_blog-hero-low.jpg/m/620x0/filters:quality(70)/' }
  ];

  return (
    <div className="home-page-modern">
      {/* Hero Banner Section */}
      <section className="hero-section">
        <div className="banner-container">
          {bannerImg ? (
            <img src={bannerImg} alt="ShopEZ Banner" className="main-banner" />
          ) : (
            <div className="banner-placeholder">
               {/* Loading state logic in CSS */}
            </div>
          )}
        </div>
      </section>

      {/* Modern Categories Section */}
      <section className="categories-section">
        <div className="section-header">
          <h3>Browse by <span>Category</span></h3>
        </div>
        <div className="categories-grid">
          {categories.map((cat, index) => (
            <div 
              key={index} 
              className="cat-card-modern" 
              onClick={() => navigate(`/category/${cat.path}`)}
            >
              <div className="cat-img-wrapper">
                <img src={cat.img} alt={cat.name} />
              </div>
              <h5>{cat.name}</h5>
            </div>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <div className="products-container-main">
        <div className="section-header">
          <h3>Featured <span>Products</span></h3>
        </div>
        <Products category='all' />
      </div>

      <Footer />
    </div>
  )
}

export default Home;