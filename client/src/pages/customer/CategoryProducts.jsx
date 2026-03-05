import React from 'react'
import Footer from '../../components/Footer'
import Products from '../../components/Products'
import '../../styles/CategoryProducts.css'
import { useParams, useNavigate } from 'react-router-dom'

const CategoryProducts = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  return (
    <div className="category-products-wrapper">
      {/* Category Header Section */}
      <div className="category-hero">
        <div className="category-hero-content">
          <nav className="breadcrumb">
            <span onClick={() => navigate('/')}>Home</span> / <span>{category}</span>
          </nav>
          <h1>{category} <span>Collection</span></h1>
          <p>Explore our handpicked selection of {category} just for you.</p>
        </div>
      </div>

      {/* Products Grid with Filters (Logic inside Products.jsx) */}
      <div className="category-container">
        <Products category={category} />
      </div>

      <Footer />
    </div>
  )
}

export default CategoryProducts