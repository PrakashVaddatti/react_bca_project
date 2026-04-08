import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // useNavigate for navigation
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faHeart, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify'; // For notifications
import 'react-toastify/dist/ReactToastify.css';

const ViewProduct = () => {
  const [product, setProduct] = useState({});
  const [mainImage, setMainImage] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [hoveredButton, setHoveredButton] = useState({});

  useEffect(() => {
    getProductDetails();
  }, []);

  const getProductDetails = async () => {
      const response = await fetch(`http://localhost:5000/product/view/${id}`);
      const result = await response.json();
      setProduct(result);
      console.log("result", result);
      if (result.images && result.images.length > 0) {
        setMainImage(`http://localhost:5000/upload/${result.images[0].imagespath}`);
      }
  };

  const handleImageChange = (index) => {
    setMainImage(`http://localhost:5000/upload/${product.images[index].imagespath}`);
    setActiveIndex(index);
  };

  const handleQuantityChange = (event) => {
      const value = parseInt(event.target.value, 10);
      if (!isNaN(value) && value >= 1) {
          setQuantity(value);
      } else if (event.target.value === '') {
          setQuantity('');
      }
  };

  const handleQuantityBlur = () => {
      if (quantity === '' || isNaN(quantity) || quantity < 1) {
          setQuantity(1);
      }
  };

  

  

  const handleBuyNow = () => {
    navigate('/addtocart');      // Redirect to cart page
  };

  return (
    <>
      {/* Main Container */}
      <div className="container mt-5 mb-5" style={{
        padding: '30px',
        backgroundColor: '#f8f9fa',
        borderRadius: '15px',
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
      }}>
        <div className="row">
          {/* Product Images */}
          <div className="col-md-6 mb-4" style={{ paddingRight: '30px' }}>
            <img
              src={mainImage}
              style={{
                height: "70vh",
                width: "100%",
                objectFit: 'contain',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease-in-out',
              }}
              alt={product.productsname || 'Product Image'}
              className="img-fluid rounded mb-3"
            />
            {/* Thumbnails */}
            <div className="d-flex justify-content-between" style={{ marginTop: '15px' }}>
              {product.images && product.images.map((img, index) => (
                <img
                  key={index}
                  src={`http://localhost:5000/upload/${img.imagespath}`}
                  alt={`Thumbnail ${index + 1}`}
                  className={`rounded ${activeIndex === index ? 'border border-primary border-3' : ''}`}
                  onMouseOver={() => handleImageChange(index)}
                  style={{
                    cursor: 'pointer',
                    width: '18%',
                    height: '12vh',
                    objectFit: 'cover',
                    opacity: activeIndex === index ? 1 : 0.7,
                    transition: 'opacity 0.2s ease-in-out, transform 0.2s ease-in-out',
                    transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: activeIndex === index ? '0 2px 5px rgba(0, 0, 0, 0.2)' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (activeIndex !== index) {
                      e.currentTarget.style.opacity = 0.9;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeIndex !== index) {
                      e.currentTarget.style.opacity = 0.7;
                    }
                  }}
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="col-md-6" style={{ paddingLeft: '30px' }}>
            {/* Product Name */}
            <h2 className="mb-3" style={{
              fontSize: '2.8rem',
              fontWeight: 'bold',
              color: '#333',
              paddingBottom: '10px',
              borderBottom: '3px solid #007bff',
              display: 'inline-block',
            }}>
              {product.productsname}
            </h2>
            {/* Model/Category */}
            <p className="text-muted mb-4" style={{ fontSize: '1.1rem', fontStyle: 'italic' }}>Model: {product.model}</p>
            {/* Price */}
            <div className="mb-3" style={{ backgroundColor: '#e9ecef', padding: '10px', borderRadius: '5px' }}>
              <span className="h4 me-2" style={{ fontSize: '2rem', color: '#28a745', fontWeight: 'bold' }}>₹{product.price}</span>
            </div>
            {/* Description */}
            <p className="mb-4" style={{ fontSize: '1rem', lineHeight: '1.8', color: '#555', textAlign: 'justify' }}>
              {product.description}
            </p>
            {/* Quantity Input */}
            <div className="mb-4" style={{
              border: '1px solid #ced4da',
              borderRadius: '8px',
              padding: '15px',
              backgroundColor: '#fff',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
              width: 'fit-content',
            }}>
              <label htmlFor="quantity" className="form-label fw-bold" style={{
                fontSize: '1.1rem',
                marginBottom: '8px',
                color: '#495057'
              }}>Quantity:</label>
              <input
                type="number"
                id="quantity"
                className="form-control"
                value={quantity}
                onChange={handleQuantityChange}
                onBlur={handleQuantityBlur}
                min="1"
                style={{
                  width: '100px',
                  borderRadius: '5px',
                  boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
                  borderColor: '#ced4da',
                  padding: '8px 12px',
                  fontSize: '1rem',
                  textAlign: 'center',
                  backgroundColor: '#fff',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#007bff';
                  e.target.style.boxShadow = '0 0 0 0.25rem rgba(0, 123, 255, 0.25)';
                }}
                onBlu={(e) => {
                  e.target.style.borderColor = '#ced4da';
                  e.target.style.boxShadow = 'inset 0 1px 3px rgba(0, 0, 0, 0.1)';
                  handleQuantityBlur();
                }}
              />
            </div>
            {/* Buttons */}
            <div className="d-flex align-items-center" style={{ marginTop: '20px' }}>
              {/* Buy Now Button */}
              <button
                className="btn btn-primary btn-lg mb-3 me-2"
                onClick={handleBuyNow}
                style={{
                  backgroundColor: hoveredButton['buy'] ? '#0056b3' : '#007bff',
                  borderColor: hoveredButton['buy'] ? '#004085' : '#007bff',
                  transition: 'background-color 0.3s ease, transform 0.2s ease',
                  transform: hoveredButton['buy'] ? 'scale(1.05)' : 'scale(1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 20px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                }}
                onMouseEnter={() => setHoveredButton(prev => ({ ...prev, [product.productsid + '_cart']: true }))}
                onMouseLeave={() => setHoveredButton(prev => ({ ...prev, [product.productsid + '_cart']: false }))}
              >
                <FontAwesomeIcon icon={faShoppingCart} /> BUY NOW
              </button>
              {/* Add to Cart Button */}
             
            </div>
          </div>
        </div>
      </div>

      {/* Footer - omitted for brevity, keep your existing footer here */}
    </>
  );
};

export default ViewProduct;