import React, { useEffect, useState } from 'react'
import '../../styles/AllUsers.css'
import axios from 'axios'

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchUsersData();
  }, [])

  const fetchUsersData = async () => {
    try {
      const userRes = await axios.get('https://shop-ez-flame.vercel.app/api/users/fetch-users');
      setUsers(userRes.data.filter(user => user.usertype === 'customer'));

      const orderRes = await axios.get('https://shop-ez-flame.vercel.app/api/orders/fetch-orders');
      setOrders(orderRes.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  }

  return (
    <div className="users-management-container">
      <div className="admin-section-header">
        <h3>User <span>Database</span></h3>
        <p>Total Customers: {users.length}</p>
      </div>

      <div className="users-list-wrapper">
        {users.map((user) => (
          <div className="user-profile-card" key={user._id}>
            <div className="user-avatar-section">
              <div className="user-initial-circle">
                {user.username.charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="user-info-grid">
              <div className="user-info-item">
                <label>System ID</label>
                <p>{user._id}</p>
              </div>
              
              <div className="user-info-item">
                <label>Customer Name</label>
                <p>{user.username}</p>
              </div>

              <div className="user-info-item">
                <label>Email Address</label>
                <p>{user.email}</p>
              </div>

              <div className="user-info-item stat-highlight">
                <label>Total Orders</label>
                <div className="order-count-pill">
                  {orders.filter(order => order.userId === user._id).length} Orders
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllUsers