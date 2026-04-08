import React, { useEffect, useState } from 'react';

function OrderTrack() {
  const [orders, setOrders] = useState([]);
  const email = localStorage.getItem('email'); // or get from auth context

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    fetch('http://localhost:5000/getUserOrders', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(console.error);
  };

  const handleComplete = (orderId) => {
    fetch('http://localhost:5000/updateOrderStatus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ orderId })
    })
      .then(res => res.json())
      .then(() => {
        alert('Order marked as completed');
        fetchOrders(); // refresh list
      })
      .catch(console.error);
  };

  return (
    <div>
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map(order => (
          <div key={order.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <p>Order ID: {order.id}</p>
            <p>Status: {order.status}</p>
            <p>Shippment address:{[order.shipping_address]}</p>
            <p>Order Date: {new Date(order.order_date).toLocaleString()}</p>
            <p>Total: ₹{order.total_amount}</p>
            {order.status !== 'Completed' && (
              <button onClick={() => handleComplete(order.id)}>I have completed</button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default OrderTrack;