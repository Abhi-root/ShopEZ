import React, { useEffect, useState } from 'react'
import '../../styles/NewProducts.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NewProduct = () => {
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
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:6001/api/products/fetch-categories');
      setAvailableCategories(response.data);
    } catch (err) {
      console.error("Category fetch failed");
    }
  }

  const handleCheckBox = (e) => {
    const value = e.target.value;
    setProductSizes(e.target.checked ? [...productSizes, value] : productSizes.filter(s => s !== value));
  }

  const handleNewProduct = async () => {
    try {
      await axios.post('http://localhost:6001/api/products/add-new-product', {
        productName, productDescription, productMainImg,
        productCarousel: [productCarouselImg1, productCarouselImg2, productCarouselImg3],
        productSizes, productGender, productCategory, productNewCategory,
        productPrice, productDiscount
      });
      alert("Inventory Updated!");
      navigate('/all-products');
    } catch (err) {
      alert("Submission failed!");
    }
  }

  return (
    <div className="new-product-page">
      <div className="entry-card">
        <div className="entry-header">
          <h3>Launch <span>New Product</span></h3>
          <p>Fill in the details to add an item to your digital storefront.</p>
        </div>

        <div className="entry-scroll-body">
          <div className="entry-section">
            <h6>Core Information</h6>
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
            <h6>Media Assets (Image URLs)</h6>
            <div className="modern-field full-width">
              <input type="text" value={productMainImg} onChange={(e) => setProductMainImg(e.target.value)} required />
              <label>Thumbnail / Main Image</label>
            </div>
            <div className="input-row-3">
              <div className="modern-field">
                <input type="text" value={productCarouselImg1} onChange={(e) => setProductCarouselImg1(e.target.value)} />
                <label>Carousel Img 1</label>
              </div>
              <div className="modern-field">
                <input type="text" value={productCarouselImg2} onChange={(e) => setProductCarouselImg2(e.target.value)} />
                <label>Carousel Img 2</label>
              </div>
              <div className="modern-field">
                <input type="text" value={productCarouselImg3} onChange={(e) => setProductCarouselImg3(e.target.value)} />
                <label>Carousel Img 3</label>
              </div>
            </div>
          </div>

          <div className="entry-section split-view">
            <div className="selection-block">
              <h6>Size Matrix</h6>
              <div className="check-grid">
                {['S', 'M', 'L', 'XL'].map(size => (
                  <label key={size} className="pill-check">
                    <input type="checkbox" value={size} checked={productSizes.includes(size)} onChange={handleCheckBox} />
                    <span>{size}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="selection-block">
              <h6>Target Audience</h6>
              <div className="radio-grid">
                {['Men', 'Women', 'Unisex'].map(gender => (
                  <label key={gender} className="pill-radio">
                    <input type="radio" name="gender" value={gender} onChange={(e) => setProductGender(e.target.value)} />
                    <span>{gender}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="entry-section">
            <h6>Pricing & Taxonomy</h6>
            <div className="input-row-3">
              <div className="modern-field">
                <select value={productCategory} onChange={(e) => setProductCategory(e.target.value)}>
                  <option value="">Select Category</option>
                  {AvailableCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  <option value="new category">+ New Category</option>
                </select>
              </div>
              <div className="modern-field">
                <input type="number" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} />
                <label>Price (₹)</label>
              </div>
              <div className="modern-field">
                <input type="number" value={productDiscount} onChange={(e) => setProductDiscount(e.target.value)} />
                <label>Discount %</label>
              </div>
            </div>
            {productCategory === 'new category' && (
              <div className="modern-field full-width mt-3">
                <input type="text" value={productNewCategory} onChange={(e) => setProductNewCategory(e.target.value)} />
                <label>New Category Name</label>
              </div>
            )}
          </div>
        </div>

        <button className="submit-entry-btn" onClick={handleNewProduct}>Publish to Store</button>
      </div>
    </div>
  )
}

export default NewProduct