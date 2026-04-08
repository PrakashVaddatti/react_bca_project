import React, { useEffect, useState } from 'react';
import { ToWords } from 'to-words';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCreditCard,
  faWallet,
  faMoneyBillWave,
  faTrash,
  faPlus,
  faMinus,
  faArrowLeft,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { toast, ToastContainer } from 'react-toastify';
import { faQrcode } from '@fortawesome/free-solid-svg-icons';

const toWords = new ToWords();

function AddtoCart() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [showPaymentSection, setShowPaymentSection] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isAddressConfirmed, setIsAddressConfirmed] = useState(false);
  const [address, setAddress] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [upiId, setUpiId] = useState('');

  const handleUpiIdChange = (e) => {
    const value = e.target.value;
    setUpiId(value);
    if (value.trim() !== '') {

      toast.info(`UPI message sent to ${value}`);
    }
  };


  useEffect(() => {
    getCartProducts();
  }, []);

  const getCartProducts = () => {
    const token = localStorage.getItem('token');
    const localCart = JSON.parse(localStorage.getItem('cart')) || [];

    if (token) {
      fetch('http://localhost:5000/getcartProduct', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => setCartItems(Array.isArray(data) ? data : []));
    } else if (localCart.length > 0) {
      setCartItems(localCart);
    }
  };

  const handleRemove = (indexToRemove) => {
    const token = localStorage.getItem('token');
    const product = cartItems[indexToRemove];

    if (token) {
      fetch('http://localhost:5000/removeFromCart', {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cartid: product.cartid })
      }).then(res => {
        if (res.ok) {
          const updated = cartItems.filter((_, i) => i !== indexToRemove);
          setCartItems(updated);
        }
      });
    } else {
      const updated = cartItems.filter((_, i) => i !== indexToRemove);
      localStorage.setItem('cart', JSON.stringify(updated));
      setCartItems(updated);
    }
  };

  const handleQuantityChange = (index, type) => {
    const token = localStorage.getItem('token');
    const updated = [...cartItems];
    let qty = Number(updated[index].quantity) || 1;

    if (type === 'inc') qty += 1;
    if (type === 'dec' && qty > 1) qty -= 1;

    updated[index].quantity = qty;
    setCartItems(updated);

    if (!token) {
      localStorage.setItem('cart', JSON.stringify(updated));
    } else {
      fetch('http://localhost:5000/updateCartQuantity', {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cartid: updated[index].cartid, quantity: qty })
      });
    }
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'SAVE10') {
      setDiscount(overallTotalAmount * 0.1);
      alert('10% discount applied!');
    } else {
      alert('Invalid coupon code');
    }
  };

  const isAddressValid = () => {
    const { name, phone, street, city, state, pincode } = address;
    return name && phone && street && city && state && pincode;
  };

  const overallTotalAmount = cartItems.reduce((total, item) => {
    const quantity = Number(item.quantity) || 1;
    const price = Number(item.price) || 0;
    return total + quantity * price;
  }, 0);

  const finalAmount = overallTotalAmount - discount;
  const shippingFee = overallTotalAmount > 999 ? 0 : 50;
  const grandTotal = finalAmount + shippingFee;

  const merchantVPA = "prakashvaddatti1825@okicici";
  const merchantName = "Green Earth Team";

  const getUPILink = (amount) => {
    return `upi://pay?pa=${encodeURIComponent(merchantVPA)}&pn=${encodeURIComponent(merchantName)}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent("Order Payment")}`;
  };


  //handle place order to email meaasge
  const email = localStorage.getItem('email');
  
  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const orderDetails = {
        items: cartItems,
        totalAmount: grandTotal,
        couponCode: couponCode, // send coupon code
        discount: discount,     // send discount amount
      };
      const shippingDetails = address;

      // Send email
      fetch('http://localhost:5000/sendOrderEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          orderDetails,
          shippingDetails
        })
      })
        .then(res => res.json())
        .then(data => {
          console.log('Email sent:', data);
          toast.success('Order details sent to your email!');
          
        })
        .catch(err => {
          console.error('Error sending email:', err);
          toast.error('Failed to send email. Please try again.');
        });

      // Finalize order
      setIsProcessing(false);
      setOrderSuccess(true);
      setCartItems([]);
      localStorage.removeItem('cart');
    }, 2000);
  };
  
  // Address add button
  const handleConfirmAddress = () => {
    const token = localStorage.getItem('token'); // or however you store your token
    if (isAddressValid()) {
      setIsProcessing(true);
      fetch('http://localhost:5000/submitAddress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token // include the token here
        },
        body: JSON.stringify(address)
      })
        .then(res => {
          if (res.ok) {
            setIsAddressConfirmed(true); // Mark address as confirmed only after success
            alert('Address confirmed and saved successfully!');
          } else {
            throw new Error('Failed to save address.');
          }
        })
        .catch(err => {
          alert('Error confirming address: ' + err.message);
        })
        .finally(() => {
          setIsProcessing(false);
        });
    } else {
      alert('Please fill in all address fields.');
    }
  };


  if (orderSuccess) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <div className="card shadow-sm border-0">
              <div className="card-body p-5">
                <div className="text-success mb-4">
                  <FontAwesomeIcon icon={faCheckCircle} size="4x" />
                </div>
                <h2 className="mb-3">Order Placed Successfully!</h2>
                <p className="lead mb-4">Thank you for your purchase. Your order has been confirmed.</p>
                <div className="d-flex justify-content-center gap-3">
                  <button
                    className="btn btn-primary px-4"
                    onClick={() => navigate('/')}
                  >
                    Continue Shopping
                  </button>
                  <button
                    className="btn btn-outline-secondary px-4"
                    onClick={() => navigate('/Productscard')}
                  >
                    View Orders
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {!showPaymentSection && (
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: 'white',
            color: '#0069d9',
            border: '2px solid #0069d9',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '1rem',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
          onClick={() => navigate(-1)}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#e6f0ff';
            e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'white';
            e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '8px' }} />
          Continue Shopping
        </button>
      )}

      <div className="row">
        <div className="col-lg-8">
          <div className="card shadow-sm mb-4 border-0">
            <div className="card-header bg-white border-0 py-3">
              <h4 className="mb-0 fw-bold">Your Shopping Cart ({cartItems.length} items)</h4>
            </div>
            <div className="card-body p-0">
              {cartItems.length === 0 ? (
                <div className="text-center py-5">
                  <div className="empty-cart-icon mb-4">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#6c757d" strokeWidth="1.5">
                      <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                  <h3 className="text-muted mb-3">Your cart is empty</h3>
                  <button
                    className="btn btn-primary px-4 py-2"
                    onClick={() => navigate('/')}
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead className="table-light">
                      <tr>
                        <th width="40%" className="ps-4">Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((product, index) => (
                        <tr key={index} className="border-top">
                          <td className="ps-4">
                            <div className="d-flex align-items-center">
                              <div className="position-relative me-3">
                                <img
                                  src={`http://localhost:5000/upload/${product.imagespath}`}
                                  alt={product.productsname}
                                  className="rounded me-3"
                                  style={{
                                    width: '80px',
                                    height: '80px',
                                    objectFit: 'cover',
                                    borderRadius: '8px'
                                  }}
                                  onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                                  }}
                                />
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
                                  {product.quantity || 1}
                                </span>
                              </div>
                              <div>
                                <h6 className="mb-1 fw-bold">{product.productsname}</h6>
                                <small className="text-muted text-truncate d-block" style={{ maxWidth: '200px' }}>
                                  {product.description}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="fw-bold">₹{product.price}</span>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <button
                                className="btn btn-sm btn-outline-secondary rounded-circle"
                                onClick={() => handleQuantityChange(index, 'dec')}
                                style={{ width: '32px', height: '32px' }}
                              >
                                <FontAwesomeIcon icon={faMinus} size="xs" />
                              </button>
                              <span className="mx-2 fw-bold">{product.quantity || 1}</span>
                              <button
                                className="btn btn-sm btn-outline-secondary rounded-circle"
                                onClick={() => handleQuantityChange(index, 'inc')}
                                style={{ width: '32px', height: '32px' }}
                              >
                                <FontAwesomeIcon icon={faPlus} size="xs" />
                              </button>
                            </div>
                          </td>
                          <td className="fw-bold">₹{(product.price * (product.quantity || 1)).toFixed(2)}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-danger rounded-circle"
                              onClick={() => handleRemove(index)}
                              style={{ width: '32px', height: '32px' }}
                              title="Remove item"
                            >
                              <FontAwesomeIcon icon={faTrash} size="xs" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>


        {/* order summary */}
        <div className="col-lg-4">
          <div className="card shadow-sm " style={{ top: '20px', border: 'none' }}>
            <div className="card-header bg-white border-0 py-3">
              <h4 className="mb-0 fw-bold">Order Summary</h4>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Subtotal:</span>
                  <span className="fw-bold">₹{overallTotalAmount.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Shipping:</span>
                  <span className={shippingFee === 0 ? 'text-success fw-bold' : 'fw-bold'}>
                    {shippingFee === 0 ? 'FREE' : `₹${shippingFee.toFixed(2)}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Discount:</span>
                    <span className="text-danger fw-bold">-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="input-group mb-3 mt-4">
                  <input
                    type="text"
                    className="form-control border-primary"
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={applyCoupon}
                  >
                    Apply
                  </button>
                </div>
                <hr className="my-3" />
                <div className="d-flex justify-content-between fw-bold fs-5 mb-4">
                  <span>Total:</span>
                  <span className="text-primary">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="mb-4 p-3 bg-light rounded">
                <h6 className="fw-bold mb-2">Total in Words:</h6>
                <p className="text-muted mb-0">{toWords.convert(grandTotal)} rupees only</p>
              </div>

              <button
                className="btn btn-primary w-100 py-3 fw-bold"
                onClick={() => setShowPaymentSection(true)}
                disabled={cartItems.length === 0}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                }}
              >
                {cartItems.length === 0 ? 'Cart is Empty' : 'Proceed to Checkout'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showPaymentSection && cartItems.length > 0 && (
        <>
          {/* Address Section */}
          <div className="row mt-4">
            <div className="col-lg-8 offset-lg-2">
              <div className="card shadow-sm mb-4 border-0">
                <div className="card-header bg-white border-0 py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0 fw-bold">Shipping Address</h4>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => setShowPaymentSection(false)}
                    >
                      Back to Cart
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={address.name}
                        onChange={(e) => setAddress({ ...address, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">Phone Number</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={address.phone}
                        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Street Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      required
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-bold">City</label>
                      <input
                        type="text"
                        className="form-control"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-bold">State</label>
                      <input
                        type="text"
                        className="form-control"
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-bold">Pincode</label>
                      <input
                        type="text"
                        className="form-control"
                        value={address.pincode}
                        onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                        required
                      />
                    </div>

                    <button
                      className="btn btn-secondary mb-3"
                      onClick={handleConfirmAddress}
                      disabled={isAddressConfirmed || isProcessing}
                    >
                      {isAddressConfirmed ? 'Address Confirmed' : 'Confirm Address'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>




          {/* Payment Section */}
          {isAddressValid() && (
            <div className="col-lg-8 offset-lg-2">
              <div className="card shadow-lg mb-5 rounded-3" style={{ fontFamily: "'Poppins', sans-serif" }}>

                {/* Header with Gradient Background */}
                <h4 className="mb-0 fw-bold">Payment Method</h4>


                {/* Content */}
                <div className="p-4">
                  {/* Button Group with Hover Effects */}
                  <div
                    className="d-flex w-100 mb-4"
                    role="group"
                    style={{
                      overflow: 'hidden',
                      borderRadius: '0.75rem',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                  >
                    <button
                      type="button"
                      className={`flex-fill fw-semibold d-flex align-items-center justify-content-center gap-2 btn ${paymentMethod === 'card' ? 'btn-gradient-primary' : 'btn-outline-primary'}`}
                      onClick={() => setPaymentMethod('card')}
                      style={{
                        padding: '0.75rem 1.2rem',
                        transition: 'all 0.3s',
                      }}
                    >
                     <FontAwesomeIcon icon={faQrcode}  className="text-primary" />
                      Scanner
                    </button>
                    <button
                      type="button"
                      className={`flex-fill fw-semibold d-flex align-items-center justify-content-center gap-2 btn ${paymentMethod === 'upi' ? 'btn-gradient-success' : 'btn-outline-success'}`}
                      onClick={() => setPaymentMethod('upi')}
                      style={{
                        padding: '0.75rem 1.2rem',
                        transition: 'all 0.3s',
                      }}
                    >
                      <FontAwesomeIcon icon={faWallet} />
                      UPI
                    </button>
                    <button
                      type="button"
                      className={`flex-fill fw-semibold d-flex align-items-center justify-content-center gap-2 btn ${paymentMethod === 'cod' ? 'btn-gradient-warning' : 'btn-outline-warning'}`}
                      onClick={() => setPaymentMethod('cod')}
                      style={{
                        padding: '0.75rem 1.2rem',
                        borderTopRightRadius: '0.75rem',
                        borderBottomRightRadius: '0.75rem',
                        transition: 'all 0.3s',
                      }}
                    >
                      <FontAwesomeIcon icon={faMoneyBillWave} />
                      CASH
                    </button>
                  </div>

                  {/* Payment Sections with Fade-in */}
                  {paymentMethod === 'card' && (
                    <div className="payment-section bg-light p-4 rounded-3 mb-4 shadow-sm text-center">
                      <h5 className="fw-bold mb-3">Scan QR to Pay via UPI</h5>
                      <QRCodeCanvas value={getUPILink(grandTotal)} size={180} level="H" />
                      <p className="mt-3">Scan this QR code with your UPI app to complete payment.</p>
                      <button
                        className="w-100 btn btn-outline-secondary py-3 fw-semibold"
                        onClick={handlePlaceOrder}
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Verifying Payment...
                          </>
                        ) : (
                          'I have completed payment'
                        )}
                      </button>
                    </div>
                  )}

                  {paymentMethod === 'upi' && (
                    <div className="payment-section animate-in bg-light p-4 rounded-3 mb-4 shadow-sm">
                      <h5 className="fw-bold mb-3 text-dark">UPI Payment</h5>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">UPI ID</label>
                        <input
                          type="text"
                          className="form-control shadow-sm rounded-2"
                          placeholder="yourname@upi"
                          value={upiId}
                          onChange={handleUpiIdChange}
                        /> </div>
                      <a
                        href={getUPILink(grandTotal)}
                        className="w-100 btn btn-gradient-info mb-4 py-3 fw-semibold shadow-hover"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => alert('You will be redirected to your UPI app. If the UPI ID is invalid, the app will notify you.')}
                      >
                        Pay ₹{grandTotal.toFixed(2)} via UPI
                      </a>
                    </div>
                  )}

                  {paymentMethod === 'cod' && (
                    <div className="payment-section animate-in bg-light p-4 rounded-3 mb-4 shadow-sm">
                      <div className="alert alert-info fw-semibold mb-4 rounded-3">
                        <strong>Note:</strong> Cash on Delivery may include additional charges.
                      </div>
                      <button
                        className="w-100 btn btn-gradient-warning py-3 fw-semibold shadow-hover"
                        onClick={handlePlaceOrder}
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Placing Order...
                          </>
                        ) : (
                          `Confirm Order (Pay ₹${grandTotal.toFixed(2)} on Delivery)`
                        )}
                      </button>
                    </div>
                  )}

                  {/* Privacy Notice */}
                  <div className="mt-4 pt-3 border-top text-center">
                    <p className="small text-muted" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      <FontAwesomeIcon icon={faCheckCircle} className="text-success me-2" />
                      Your personal data will be used to process your order and for other purposes described in our privacy policy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
export default AddtoCart;