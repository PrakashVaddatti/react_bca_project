import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function DeleteProduct() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const [wishlistStatus, setWishlistStatus] = useState({});
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredButton, setHoveredButton] = useState({});

  // Fetch products
  const getProducts = async () => {
    let response = await fetch("http://localhost:5000/displayProducts");
    let result = await response.json();
    setProducts(result);
    setFilteredProducts(result);
    setWishlistStatus({});
  };

  // Fetch categories
  const getCategories = async () => {
    let response = await fetch("http://localhost:5000/allcatgoys");
    let result = await response.json();
    setCategories([{ categoryname: "All" }, ...result]);
  };

  useEffect(() => {
    getProducts();
    getCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.categoryname === selectedCategory));
    }
  }, [selectedCategory, products]);

  const handleWishlistClick = async (product) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning('Please log in to add items to your wishlist.', { position: "top-right" });
      return;
    }

    const isInWishlist = wishlistStatus[product.productsid];
    // Toggle the wishlist status
    const newStatus = !isInWishlist;
    setWishlistStatus(prev => ({ ...prev, [product.productsid]: newStatus }));

    if (newStatus) {
      toast.success('Added to wishlist!', { position: "top-right" });
    } else {
      toast.success('Removed from wishlist!', { position: "top-right" });
    }
  };

  const handleDelete = async (productid) => {
    try {
      const response = await fetch(`http://localhost:5000/deleteproduct/${productid}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        toast.success(result.message || "Product deleted successfully");
        // Refresh products after deletion
        getProducts();
      } else {
        toast.error(result.message || "Failed to delete product");
      }
    } catch (err) {
      toast.error("Error deleting product");
    }
  };

  return (
    <>
      <ToastContainer />

      {/* Container */}
      <div style={{ padding: '30px', backgroundColor: '#f8f9fa' }}>
        {/* Heading */}
        <h2
          style={{
            fontSize: '2.8rem',
            fontWeight: '700',
            color: '#007bff',
            textShadow: '1px 1px 3px rgba(0, 0, 0, 0.15)',
            textAlign: 'center',
            marginBottom: '30px',
            letterSpacing: '1px'
          }}
        >
          Our Products
        </h2>

        {/* Category Filter */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {categories.map((cat, index) => (
              <option key={index} value={cat.categoryname}>{cat.categoryname}</option>
            ))}
          </select>
        </div>

        {/* Product Grid */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.productsid}
                style={{
                  flex: '1 1 calc(33% - 40px)',
                  minWidth: '250px',
                  maxWidth: '350px',
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: hoveredCard === product.productsid 
                    ? '0 12px 24px rgba(0,0,0,0.2)' 
                    : '0 4px 8px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  transform: hoveredCard === product.productsid ? 'translateY(-5px)' : 'translateY(0)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onMouseEnter={() => setHoveredCard(product.productsid)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Wishlist Icon */}
                <div
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    cursor: 'pointer',
                    fontSize: '1.5rem',
                    color: '#dc3545',
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    borderRadius: '50%',
                    padding: '5px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    transition: 'transform 0.2s',
                    transform: hoveredCard === product.productsid ? 'scale(1.2)' : 'scale(1)'
                  }}
                  onClick={() => handleWishlistClick(product)}
                >
                  <FontAwesomeIcon icon={wishlistStatus[product.productsid] ? solidHeart : regularHeart} />
                </div>

                {/* Product Image */}
                <img
                  src={`http://localhost:5000/upload/${product.imagespath}`}
                  alt={product.productsname}
                  style={{
                    height: '40vh',
                    width: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s',
                  }}
                />

                {/* Card Details */}
                <div style={{ padding: '15px', flex: '1', display: 'flex', flexDirection: 'column' }}>
                  {/* Title */}
                  <h5
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: '600',
                      color: '#333',
                      marginBottom: '10px',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase'
                    }}
                  >
                    {product.productsname}
                  </h5>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: '#555',
                      lineHeight: '1.4',
                      flexGrow: 1,
                      marginBottom: '15px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {product.description
                      ? product.description.length > 100
                        ? product.description.substring(0, 100) + '...'
                        : product.description
                      : 'No description available.'}
                  </p>

                  {/* Price */}
                  {product.price && (
                    <div
                      style={{
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        color: '#007bff',
                        marginBottom: '15px'
                      }}
                    >
                      Price: {product.price}
                    </div>
                  )}

                  {/* Buttons */}
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(product.productsid)}
                      style={{
                        flex: 1,
                        padding: '10px 15px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: '#dc3545',
                        color: '#fff',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        transition: 'all 0.3s',
                        marginRight: '10px'
                      }}
                      onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
                      onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ width: '100%', textAlign: 'center', marginTop: '50px', fontSize: '1.2rem', color: '#555' }}>
              No products found in this category.
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: '#222',
          color: '#eee',
          padding: '30px 20px',
          marginTop: '50px'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
            {/* About */}
            <div style={{ flex: '1 1 200px', marginBottom: '20px' }}>
              <h5 style={{ marginBottom: '10px' }}>About Us</h5>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>Short description about your store.</p>
            </div>
            {/* Quick Links */}
            <div style={{ flex: '1 1 200px', marginBottom: '20px' }}>
              <h5 style={{ marginBottom: '10px' }}>Quick Links</h5>
              <ul style={{ listStyle: 'none', padding: 0, lineHeight: '1.6' }}>
                <li><a href="/" style={{ color: '#eee', textDecoration: 'none' }}>Home</a></li>
                <li><a href="/contact" style={{ color: '#eee', textDecoration: 'none' }}>Contact</a></li>
                <li><a href="/privacy" style={{ color: '#eee', textDecoration: 'none' }}>Privacy Policy</a></li>
              </ul>
            </div>
            {/* Contact */}
            <div style={{ flex: '1 1 200px', marginBottom: '20px' }}>
              <h5 style={{ marginBottom: '10px' }}>Contact</h5>
              <p style={{ marginBottom: '8px' }}>Email: info@yourstore.com</p>
              <p>Phone: +123 456 7890</p>
            </div>
          </div>
          <hr style={{ borderColor: 'rgba(255,255,255,0.2)', margin: '20px 0' }} />
          <div style={{ textAlign: 'center', fontSize: '0.9rem', color: '#aaa' }}>
            © 2023 Your E-commerce Store. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}

export default DeleteProduct;