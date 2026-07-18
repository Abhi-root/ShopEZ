import React from 'react'
import '../styles/FlashSale.css';

const FlashSale = () => {
  // Using an array to keep code clean and repeatable
  const products = [1, 2, 3, 4, 5, 6];

  return (
    <div className="flashSaleContainer">
        <div className="flashSale-header">
            <h3>⚡ Flash Sale</h3>
            <span className="timer">Ends in: 04h : 20m : 59s</span>
        </div>
        
        <div className="flashSale-body">
            {products.map((item) => (
                <div className="flashSaleCard" key={item}>
                    <div className="image-container">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGnbY9YlH663xUNGHOe0lS9n-zSwrLtiEFVw&usqp=CAU" alt="product" />
                        <span className="discount-badge">30% OFF</span>
                    </div>
                    
                    <div className="flashSaleCard-data">
                        <h6>Premium Product {item}</h6>
                        <p>High-quality build with modern features...</p>
                        <div className="price-section">
                            <h5 className="current-price">₹1,499</h5>
                            <h5 className="old-price">₹1,999</h5>
                        </div>
                        <button className="add-to-cart">Add to Cart</button>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default FlashSale;