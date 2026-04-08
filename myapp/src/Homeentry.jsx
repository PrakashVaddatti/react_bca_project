import { Link } from "react-router-dom";
import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { motion } from 'framer-motion'; // Import motion
import { FaFacebookF, FaTwitter, FaYoutube, FaInstagram } from 'react-icons/fa'; // Import social icons (if you want them in the footer)


function Homeentry() {

  // Framer Motion variants for animations
  const heroVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1.5, ease: "easeOut" } },
  };

  const overlayVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 1.8, ease: "easeOut" } },
  };

  // Updated CTA Button Variants for Color and Animation
  const ctaButtonVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.6, delay: 2.2, ease: "easeOut" } },
    hover: {
      scale: 1.1,
      backgroundColor: '#0056b3', // Darker blue on hover
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)', // More prominent shadow
      transition: { duration: 0.3 }
    },
    tap: { scale: 0.95 }, // Slight shrink on tap
  };


  const footerVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut", delay: 0.8 } },
  };

  const footerColumnVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } },
  };

  // Updated Social Icon Variants for Color and Animation
  const socialIconVariants = {
    hover: {
      scale: 1.3, // Larger scale on hover
      rotate: 15, // More rotation
      color: '#007bff', // Change color on hover (example blue)
      transition: { duration: 0.3 }
    },
    tap: { scale: 0.9 },
  };


  // Example HD images for the hero carousel (replace with your actual image URLs)
  // Aim for high-resolution images suitable for backgrounds.
  const heroImages = [
    "https://images.unsplash.com/photo-1570295835271-04c05b4ed943?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWVkaWNpbmFsJTIwcGxhbnRzfGVufDB8fDB8fHww", // Example high-res image
    "https://plantlane.com/cdn/shop/articles/bottles-homeopathic-globules-thu_1498x.jpg?v=1688375982",
    "https://cdn.shopify.com/s/files/1/0085/2344/8371/files/variety-spices-are-cutting-board-with-green-vegetable-background_480x480.jpg?v=1686387326",
    "https://images.unsplash.com/photo-1599148401005-fe6d7497cb5e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1lZGljaW5hbCUyMHBsYW50c3xlbnwwfHwwfHx8MA%3D%3D",
    "https://m.media-amazon.com/images/I/41z3ZDsfuZL._AC_UF350,350_QL80_.jpg",
  ];


  return (
    <>
      {/* Hero Section with Carousel */}
      <motion.div
        style={{
          position: 'relative', // Needed for overlay positioning
          width: '100%',
          height: '100vh', // Full viewport height
          overflow: 'hidden', // Hide overflowing carousel content
        }}
        variants={heroVariants}
        initial="hidden"
        animate="visible"
      >
        <Carousel
          showArrows={false} // Hide navigation arrows
          showStatus={false} // Hide status (e.g., "1 of 5")
          showIndicators={false} // Hide dot indicators
          infiniteLoop={true} // Loop the carousel
          autoPlay={true} // Auto-play the carousel
          interval={8000} // Auto-play interval (adjust as needed)
          transitionTime={1000} // Transition duration
          stopOnHover={false} // Don't stop auto-play on hover
          swipeable={false} // Disable swipe gestures
          dynamicHeight={false} // Keep a consistent height
          showThumbs={false} // Hide thumbnail navigation
          axis="horizontal" // Horizontal scrolling
        // Inline styles for carousel elements are limited.
        // We'll apply styles to the images within the carousel.
        >
          {heroImages.map((image, index) => (
            <div key={index} style={{ height: '100vh' }}> {/* Ensure carousel item takes full height */}
              <img
                src={image}
                alt={`Hero image ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover', // Cover the container while maintaining aspect ratio
                  objectPosition: 'center', // Center the image
                }}
              />
            </div>
          ))}
        </Carousel>

        {/* Overlay with CTA Button */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent dark overlay
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '20px',
            zIndex: 1, // Ensure overlay is above the carousel
          }}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 style={{ color: '#ffffff', fontSize: '3.5rem', marginBottom: '30px', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' }}>
            Discover Innovation
          </h1>
          <p style={{ color: '#cccccc', fontSize: '1.5rem', marginBottom: '40px', maxWidth: '700px', lineHeight: '1.6' }}>
            Join us to explore cutting-edge products and solutions that are shaping the future.
          </p>
          <motion.div
            variants={ctaButtonVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
            // Apply inline styles for initial appearance
            style={{
              display: 'inline-block',
              backgroundColor: 'green', // Blue background
              color: '#ffffff', // White text
              padding: '15px 35px', // Padding
              borderRadius: '30px', // Rounded corners
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '1rem', // Larger font size
              boxShadow: '0 4px 8px rgba(28, 178, 126, 0.2)', // Shadow for depth
              cursor: 'pointer', // Pointer cursor on hover
              transition: 'background-color 0.3s ease', // Optional hover transition
            }}
          >
            <Link
              to="/signin"
              // Remove inline styles that will be handled by Framer Motion variants
              style={{ color: 'inherit', textDecoration: 'none', display: 'block', height: '100%', width: '100%' }}
            >
              Sign Up Free
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Additional Content Section (Optional) */}
      {/* You can add sections here for About, Features, etc. */}
      <div style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: '#f8f9fa' }}> {/* Light grey background */}
        <h2 style={{ color: '#343a40', fontSize: '2.5rem', marginBottom: '20px' }}>Why Join Us?</h2>
        <p style={{ color: '#6c757d', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
          Access exclusive content, get early access to new products, and join a community of innovators.
        </p>
        {/* Example of an optional button in this section */}

        <motion.button
          style={{
            marginTop: '30px',
            padding: '12px 25px',
            backgroundColor: '#28a745', // Success green
            color: '#ffffff',
            border: 'none',
            borderRadius: '25px',
            fontSize: '1.1rem',
            cursor: 'pointer',
          }}
          whileHover={{ backgroundColor: '#218838', scale: 1.05 }} // Darker green and scale on hover
          whileTap={{ scale: 0.95 }} // Slight shrink on tap
        >
          Learn More
        </motion.button>

      </div>


      {/* Advanced Footer Section */}
      <motion.footer
        style={{
          backgroundColor: '#343a40', // Dark background
          color: '#ffffff', // White text
          padding: '50px 20px 20px', // Top padding, side padding, bottom padding
          fontFamily: "'Arial', sans-serif", // Consistent font
        }}
        variants={footerVariants}
        initial="hidden"
        animate="visible"
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap', // Allow wrapping on smaller screens
            maxWidth: '1200px', // Max width for footer content
            margin: '0 auto', // Center footer content
            marginBottom: '30px',
            gap: '30px', // Space between columns
          }}
        >
          <motion.div style={{ flex: '1 1 200px' }} variants={footerColumnVariants}> {/* Flex basis for wrapping */}
            <h4 style={{ color: 'white', marginBottom: '15px', fontSize: '1.3rem', fontFamily: 'bold' }}>Consumer products</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '8px' }}><Link to="#" style={{ textDecoration: 'none', color: '#cccccc', transition: 'color 0.3s ease' }}>Support</Link></li>
              <li style={{ marginBottom: '8px' }}><Link to="#" style={{ textDecoration: 'none', color: '#cccccc', transition: 'color 0.3s ease' }}>Product registration</Link></li>
              <li style={{ marginBottom: '8px' }}><Link to="#" style={{ textDecoration: 'none', color: '#cccccc', transition: 'color 0.3s ease' }}>My Philips</Link></li>
              <li style={{ marginBottom: '8px' }}><Link to="#" style={{ textDecoration: 'none', color: '#cccccc', transition: 'color 0.3s ease' }}>E-Store</Link></li>
            </ul>
          </motion.div>

          <motion.div style={{ flex: '1 1 200px' }} variants={footerColumnVariants}>
            <h4 style={{ color: 'white', marginBottom: '15px', fontSize: '1.3rem', fontFamily: 'bold' }}>Healthcare professionals</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '8px' }}><Link to="#" style={{ textDecoration: 'none', color: '#cccccc', transition: 'color 0.3s ease' }}>Products</Link></li>
              <li style={{ marginBottom: '8px' }}><Link to="#" style={{ textDecoration: 'none', color: '#cccccc', transition: 'color 0.3s ease' }}>Services</Link></li>
              <li style={{ marginBottom: '8px' }}><Link to="#" style={{ textDecoration: 'none', color: '#cccccc', transition: 'color 0.3s ease' }}>Specialties</Link></li>
              <li style={{ marginBottom: '8px' }}><Link to="#" style={{ textDecoration: 'none', color: '#cccccc', transition: 'color 0.3s ease' }}>Solutions</Link></li>
            </ul>
          </motion.div>

          <motion.div style={{ flex: '1 1 200px' }} variants={footerColumnVariants}>
            <h4 style={{ color: 'white', marginBottom: '15px', fontSize: '1.3rem', fontFamily: 'bold' }}>Other business solutions</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '8px' }}><Link to="#" style={{ textDecoration: 'none', color: '#cccccc', transition: 'color 0.3s ease' }}>Lighting</Link></li>
              <li style={{ marginBottom: '8px' }}><Link to="#" style={{ textDecoration: 'none', color: '#cccccc', transition: 'color 0.3s ease' }}>Automotive</Link></li>
              <li style={{ marginBottom: '8px' }}><Link to="#" style={{ textDecoration: 'none', color: '#cccccc', transition: 'color 0.3s ease' }}>Hearing solutions</Link></li>
              <li style={{ marginBottom: '8px' }}><Link to="#" style={{ textDecoration: 'none', color: '#cccccc', transition: 'color 0.3s ease' }}>More</Link></li>
            </ul>
          </motion.div>

          <motion.div style={{ flex: '1 1 200px' }} variants={footerColumnVariants}>
            <h4 style={{ color: 'white', marginBottom: '15px', fontSize: '1.3rem', fontFamily: 'bold' }}>About us</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '8px' }}><Link to="#" style={{ textDecoration: 'none', color: '#cccccc', transition: 'color 0.3s ease' }}>News</Link></li>
              <li style={{ marginBottom: '8px' }}><Link to="#" style={{ textDecoration: 'none', color: '#cccccc', transition: 'color 0.3s ease' }}>Investor Relations</Link></li>
              <li style={{ marginBottom: '8px' }}><Link to="#" style={{ textDecoration: 'none', color: '#cccccc', transition: 'color 0.3s ease' }}>Careers</Link></li>
              <li style={{ marginBottom: '8px' }}><Link to="#" style={{ textDecoration: 'none', color: '#cccccc', transition: 'color 0.3s ease' }}>More</Link></li>
            </ul>
          </motion.div>
        </div>

        <hr style={{ borderColor: '#555', margin: '30px auto', maxWidth: '1200px' }} /> {/* Styled HR */}

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center', // Vertically align items
            flexWrap: 'wrap',
            maxWidth: '1200px',
            margin: '0 auto',
            paddingTop: '20px',
            gap: '20px', // Space between bottom sections
          }}
        >
          <div style={{ flex: '1 1 150px' }}> {/* Logo */}
            {/* Replace with your logo or text */}
            <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#ffffff' }}>Green Earth</span>
          </div>

          <div style={{ flex: '1 1 200px' }}> {/* Contact Links */}
            <h4 style={{ color: 'white', marginBottom: '15px', fontSize: '1.3rem', fontFamily: 'bold' }}>Contact & support</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '8px' }}><Link to="#" style={{ textDecoration: 'none', color: '#cccccc', transition: 'color 0.3s ease' }}>Customer support</Link></li>
              <li style={{ marginBottom: '8px' }}><Link to="#" style={{ textDecoration: 'none', color: '#cccccc', transition: 'color 0.3s ease' }}>Professional support</Link></li>
              <li style={{ marginBottom: '8px' }}><Link to="#" style={{ textDecoration: 'none', color: '#cccccc', transition: 'color 0.3s ease' }}>Company contacts</Link></li>
            </ul>
          </div>

          <div style={{ flex: '1 1 250px' }}> {/* Social */}
            <h4 style={{ color: 'white', marginBottom: '15px', fontSize: '1.3rem', fontFamily: 'bold' }}>Stay up-to-date</h4>
            <Link to="#" style={{ color: '#cccccc', textDecoration: 'none', display: 'block', marginBottom: '15px', transition: 'color 0.3s ease' }}>Subscribe to exclusive offers</Link>
            <div style={{ display: 'flex', gap: '15px' }}> {/* Social icons */}
              <motion.div variants={socialIconVariants} whileHover="hover" whileTap="tap">
                <Link to="#" style={{ color: 'inherit', fontSize: '1.5rem' }}><FaFacebookF /></Link> {/* Color inherited from hover variant */}
              </motion.div>
              <motion.div variants={socialIconVariants} whileHover="hover" whileTap="tap">
                <Link to="#" style={{ color: 'inherit', fontSize: '1.5rem' }}><FaTwitter /></Link> {/* Color inherited from hover variant */}
              </motion.div>
              <motion.div variants={socialIconVariants} whileHover="hover" whileTap="tap">
                <Link to="#" style={{ color: 'inherit', fontSize: '1.5rem' }}><FaYoutube /></Link> {/* Color inherited from hover variant */}
              </motion.div>
              <motion.div variants={socialIconVariants} whileHover="hover" whileTap="tap">
                <Link to="#" style={{ color: 'inherit', fontSize: '1.5rem' }}><FaInstagram /></Link> {/* Color inherited from hover variant */}
              </motion.div>
            </div>
          </div>

          <div style={{ flex: '1 1 150px', textAlign: 'right' }}> {/* Country/Region */}
            <h4 style={{ color: 'white', marginBottom: '15px', fontSize: '1.3rem', fontFamily: 'bold' }}>Select country</h4>
            <li style={{ color: '#cccccc' }}>India (English)</li>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '0.9rem', color: '#999' }}>
          <p>© {new Date().getFullYear()} Your Brand. All rights reserved.</p>
          <div style={{ marginTop: '10px' }}>
            <Link to="#" style={{ color: '#999', textDecoration: 'none', marginRight: '15px' }}>Privacy Policy</Link>
            <Link to="#" style={{ color: '#999', textDecoration: 'none' }}>Terms of Service</Link>
          </div>
        </div>
      </motion.footer>
    </>
  );
}

export default Homeentry;