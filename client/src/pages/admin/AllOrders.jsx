import React, { useEffect, useState } from 'react'
import '../../styles/AllOrders.css'
import axios from 'axios';

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [updateStatus, setUpdateStatus] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:6001/api/orders/fetch-orders`);
      setOrders(response.data.reverse());
    } catch (err) {
      console.error("Fetch orders failed:", err);
    }
  }

  const cancelOrder = async (orderId) => {
    try {
      const { data } = await axios.put('http://localhost:6001/api/orders/cancel-order', { orderId });
      alert(data.message || "Order cancelled!!");
      fetchOrders();
    } catch (err) {
      alert("Order cancellation failed!!");
    }
  };

  const updateOrderStatus = async (id) => {
    if (!updateStatus) return alert("Please select a status");
    try {
      await axios.put('http://localhost:6001/api/orders/update-order-status', { id, updateStatus });
      alert("Order status updated!!");
      setUpdateStatus('');
      fetchOrders();
    } catch (err) {
      alert("Order update failed!!");
    }
  }

  return (
    <div className="orders-management-page">
      <div className="page-header">
        <h3>Order <span>Management</span></h3>
        <p>Monitor and manage all customer transactions.</p>
      </div>

      <div className="orders-list-scroll">
        {orders.map((order) => (
          <div className={`order-card-modern ${order.orderStatus}`} key={order._id}>
            <div className="order-main-info">
              <div className="order-img-container">
                <img src={order.mainImg} alt={order.title} />
              </div>
              
              <div className="order-details-grid">
                <div className="detail-header">
                  <h4>{order.title}</h4>
                  <span className={`status-pill ${order.orderStatus}`}>{order.orderStatus}</span>
                </div>

                <div className="info-row">
                  <div className="info-block">
                    <label>Order Info</label>
                    <p><b>Size:</b> {order.size} | <b>Qty:</b> {order.quantity}</p>
                    <p className="price-tag"><b>Total:</b> ₹{parseInt(order.price - (order.price * order.discount) / 100) * order.quantity}</p>
                  </div>

                  <div className="info-block">
                    <label>Customer Details</label>
                    <p><b>Name:</b> {order.name}</p>
                    <p><b>Email:</b> {order.email}</p>
                    <p><b>Mobile:</b> {order.mobile}</p>
                  </div>

                  <div className="info-block">
                    <label>Shipping Address</label>
                    <p>{order.address}</p>
                    <p><b>Pincode:</b> {order.pincode}</p>
                    <p><b>Date:</b> {order.orderDate.slice(0, 10)}</p>
                  </div>
                </div>

                <div className="order-actions-row">
                  {order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled' && (
                    <div className="status-update-box">
                      <select 
                        className="modern-select" 
                        defaultValue="" 
                        onChange={(e) => setUpdateStatus(e.target.value)}
                      >
                        <option value="" disabled>Change Status</option>
                        <option value="Order placed">Order Placed</option>
                        <option value="In-transit">In-transit</option>
                        <option value="delivered">Delivered</option>
                      </select>
                      <button className="btn-update" onClick={() => updateOrderStatus(order._id)}>Update</button>
                    </div>
                  )}

                  {(order.orderStatus === 'order placed' || order.orderStatus === 'In-transit') && (
                    <button className="btn-cancel" onClick={() => cancelOrder(order._id)}>Cancel Order</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllOrders