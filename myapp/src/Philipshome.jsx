import { Link } from 'react-router-dom';
import React from "react";
import { useState } from 'react';
import { motion } from 'framer-motion'; // Animate
import { FiSearch, FiUser, FiLogOut } from 'react-icons/fi'; // Icons
import { FaHome, FaQuestionCircle, FaBoxOpen, FaReact,
  FaTrash ,FaCartPlus, FaSignOutAlt, FaInfoCircle, FaPlusCircle } from 'react-icons/fa'; // Icons
import { MdAddShoppingCart } from 'react-icons/md';

function Philipshome({ role }) {


  const [hovering, setHovering] = useState(false);
  const handleMouseEnter = () => {
    setHovering(true);
  };

  const handleMouseLeave = () => {
    setHovering(false);
  };

  const bannerVariants = {
    initial: { y: -50, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const navbarVariants = {
    initial: { y: -50, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut", delay: 0.1 } },
  };

  const logoVariants = {
    initial: { x: -30, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut", delay: 0.3 } },
  };

  const menuVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.4,
      },
    },
  };

  const menuItemVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  };

  const searchProfileVariants = {
    initial: { x: 30, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut", delay: 0.5 } },
  };

  return (
    <>
      {/* Top Banner */}
      <motion.div
        style={{
          backgroundColor: 'green',
          color: 'white',
          textAlign: 'center',
          padding: '10px 0',
          fontSize: '0.9rem',
          fontWeight: 'bold',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 1030,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
        variants={bannerVariants}
        initial="initial"
        animate="animate"
      >
        📢 Exclusive deal: Sign up and save additional 10% – limited time only!
      </motion.div>

      {/* Navbar */}
      <motion.div
        style={{
          backgroundColor: '#fff',
          padding: '15px 30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          zIndex: 1020,
          top: '40px',
          left: 0,
          width: '100%',
          position: 'fixed',
        }}
        variants={navbarVariants}
        initial="initial"
        animate="animate"
      >
        {/* Logo */}
        <div>
          <img src="https://img.freepik.com/premium-vector/ecommerce-logo-design_624194-152.jpg?semt=ais_hybrid&w=740" alt="Logo" style={{ height: '50px', marginLeft: '10px' }} />
        </div>

        {/* Role-based menu items */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginRight: '250px' }}>
          {!role ? (
            <>
              {/* Home Button */}
              <Link
                to="/home"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 15px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  marginRight: '20px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'inherit',
                }}
              >
                <FaHome style={{ marginRight: '8px', fontSize: '1.2rem' }} />
                Home
              </Link>
              {/* Support Button */}
              <Link
                to="/support"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 15px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'inherit',
                }}
              >
                <FaQuestionCircle style={{ marginRight: '8px', fontSize: '1.2rem' }} />
                Support
              </Link>
            </>
          ) : role === "USER" ? (
            <>

              <Link
                to="/home"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 15px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  marginRight: '20px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'inherit',
                }}
              >
                <FaHome style={{ marginRight: '8px', fontSize: '1.2rem' }} />
                Home
              </Link>


              {/* Products Button */}
              <Link
                to="/Productscard"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 15px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  marginRight: '20px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'inherit',
                }}
              >
                <FaBoxOpen style={{ marginRight: '8px', fontSize: '1.2rem' }} />
                Products
              </Link>


              {/* Add to Cart Button */}
              <Link
                to="/addtocart"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 15px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  marginRight: '20px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'inherit',
                }}
              >
                <FaCartPlus style={{ marginRight: '8px', fontSize: '1.2rem' }} />
                AddtoCart
              </Link>

              <Link
                to="/ordertrack"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 15px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  marginRight: '20px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'inherit',
                }}
              >
                <FaHome style={{ marginRight: '8px', fontSize: '1.2rem' }} />
                OrderTrack
              </Link>


              {/* Logout Button */}

            </>
          ) : (
            // Admin or other roles
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {/* Details */}
              <Link
                to="/Details"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 15px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'inherit',
                }}
              >
                <FaInfoCircle style={{ marginRight: '8px', fontSize: '1.2rem' }} />
                Details
              </Link>
              {/* Products */}
              <Link
                to="/Productscard"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 15px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'inherit',
                }}
              >
                <MdAddShoppingCart style={{ marginRight: '8px', fontSize: '1.2rem' }} />
                Products

              </Link>
              {/* Add Product */}
              <Link
                to="/addproducts"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 15px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'inherit',
                }}
              >
                <FaPlusCircle style={{ marginRight: '8px', fontSize: '1.2rem' }} />
                AddProduct

              </Link>

              <Link
                to="/deleteproduct"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 15px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'inherit',
                }}
              >
                <FaTrash  style={{ marginRight: '8px', fontSize: '1.2rem' }} />
                DeleteProduct

              </Link>
              {/* Logout */}

            </div>
          )}
        </div>

        {/* Search Box */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <motion.div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px 15px',
              marginRight: '20px',
              borderRadius: '30px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              background: 'transparent', // No background color
              width: '220px',
            }}
            whileHover={{
              boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
            }}
          >
            {/* Search Icon */}
            <FiSearch style={{ marginRight: '10px', fontSize: '1.2rem', color: '#000' }} />
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search products..."
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                color: '#000',
                fontSize: '1rem',
                fontWeight: '400',
              }}
            />
          </motion.div>


          {/* Sign In Icon */}
          <motion.div
            style={{
              marginLeft: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '50px',
              height: '50px',
              background: 'transparent',
              borderRadius: '50%',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              cursor: 'pointer',
              position: 'relative', // for dropdown positioning
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Link

              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                color: '#000',
                fontSize: '1.3rem',
                textDecoration: 'none',
              }}
            >
              <FiLogOut />
            </Link>

            {/* Dropdown Menu */}
            {hovering && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%', // below the icon
                  right: 0,
                  backgroundColor: '#fff',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  borderRadius: '8px',
                  marginTop: '5px',
                  minWidth: '150px',
                  zIndex: 999,
                }}
                onClick={() => setHovering(false)}
              >
                {/* Example dropdown items */}

                <Link
                  to="/profile"
                  style={{
                    display: 'block',
                    padding: '10px',
                    textDecoration: 'none',
                    color: '#000',
                  }}
                  onClick={() => setHovering(false)}
                >
                  <FiUser /> Profile
                </Link>


                <Link
                  to="/Register"
                  style={{
                    display: 'block',
                    padding: '10px',
                    textDecoration: 'none',
                    color: '#000',
                  }}
                  onClick={() => setHovering(false)}
                >
                  <FiUser /> Register
                </Link>
                <Link
                  to="/signin "
                  style={{
                    display: 'block',
                    padding: '10px',
                    textDecoration: 'none',
                    color: '#000',
                    borderBottom: '1px solid #ddd',
                  }}
                  onClick={() => setHovering(false)} // Close on item click
                >Log-In
                </Link>
                <Link
                  to="/Logout"
                  style={{
                    display: 'block',
                    padding: '10px',
                    textDecoration: 'none',
                    color: '#000',
                  }}
                  onClick={() => setHovering(false)}
                >
                  <FaSignOutAlt /> Logout
                </Link>
                <Link

                  style={{
                    display: 'block',
                    padding: '10px',
                    textDecoration: 'none',
                    color: '#000',
                  }}
                  onClick={() => setHovering(false)}
                >
                  Setting
                </Link>
              </div>
            )}
          </motion.div>
        </div>

        {/* Optional CSS for pulse animation */}
        <style>
          {`
            @keyframes pulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.2); }
              100% { transform: scale(1); }
            }
          `}
        </style>
      </motion.div>

      {/* Spacer for fixed header */}
      <div style={{ paddingTop: '130px' }}></div>
    </>
  );
}

export default Philipshome;