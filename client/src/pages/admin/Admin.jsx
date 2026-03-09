import React, { useEffect, useState } from 'react'
import '../../styles/Admin.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

const Admin = () => {
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [banner, setBanner] = useState('');

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    if (userType !== 'admin') {
      navigate('/'); // Agar admin nahi hai toh home bhej do
    }
  }, [navigate]);

  useEffect(() => {
    fetchCountData();
  }, []);

  const fetchCountData = async () => {
    try {
      const users = await axios.get('https://shop-ez-flame.vercel.app/api/users/fetch-users');
      setUserCount(users.data.length - 1);
      
      const products = await axios.get('https://shop-ez-flame.vercel.app/api/products/fetch-products');
      setProductCount(products.data.length);
      
      const orders = await axios.get('https://shop-ez-flame.vercel.app/api/orders/fetch-orders');
      setOrdersCount(orders.data.length);
    } catch (err) {
      console.log("Error fetching counts:", err);
    }
  }

const updateBanner = async () => {
  try {
    // URL routes file se match hona chahiye: /api/banners
    await axios.post('https://shop-ez-flame.vercel.app/api/banners', { bannerUrl: banner });
    alert("Banner updated successfully!");
    setBanner('');
  } catch (err) {
    console.log("Update error:", err.response);
  }
}

  const adminStats = [
    { title: 'Total Users', count: userCount, path: '/all-users', btnText: 'Manage Users' },
    { title: 'Inventory', count: productCount, path: '/all-products', btnText: 'View Stock' },
    { title: 'Active Orders', count: ordersCount, path: '/all-orders', btnText: 'Check Orders' },
    { title: 'New Product', count: '+', path: '/new-product', btnText: 'Launch Now' }
  ];

  return (
    <div className="admin-dashboard-modern">
      <div className="admin-welcome-header">
        <h1>Admin <span>Control Center</span></h1>
        <p>Real-time overview of your store's performance.</p>
      </div>

      <div className="admin-stats-grid">
        {adminStats.map((stat, index) => (
          <div className="stat-card-premium" key={index}>
            <h5>{stat.title}</h5>
            <div className="stat-value">{stat.count}</div>
            <button onClick={() => navigate(stat.path)}>{stat.btnText}</button>
          </div>
        ))}
      </div>

      <div className="admin-action-row">
        <div className="banner-update-card">
          <h5>Visual Customization</h5>
          <p>Update your home screen hero banner</p>
          <div className="custom-input-group">
            <input 
              type="text" 
              placeholder="Enter Banner Image URL..." 
              value={banner} 
              onChange={(e) => setBanner(e.target.value)} 
            />
            <button onClick={updateBanner}>Deploy Banner</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin;