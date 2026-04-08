import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Keep the base styles
import { Carousel } from 'react-responsive-carousel';

// Import your custom CSS file for the carousel
import './CarouselStyles.css';

function Signup() {

  // Example product images for the carousel with added content properties
  const carouselImages = [
    {
      src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMPAg-iTP1rr5YcO9NN9xzYWYrE2lcH9JaoFMXaIS6weXHOIcDFt33EyUFsA09dEbHvxY&usqp=CAU",
      alt: "Immersive Audio Experience",
      heading: "Immersive Audio Experience",
      description: "Discover our latest collection of high-fidelity headphones and speakers.",
      buttonText: "Shop Audio",
      buttonLink: "#" // Replace with actual link
    },
    {
      src: "https://t3.ftcdn.net/jpg/03/22/38/74/240_F_322387467_fPUjjLSp00lky9uMttVYCDL0px7HWHm1.jpg",
      alt: "Elevate Your Style",
      heading: "Elevate Your Style",
      description: "Explore our range of stylish and functional wearable technology.",
      buttonText: "Shop Wearables",
      buttonLink: "#" // Replace with actual link
    },
    {
      src: "https://t4.ftcdn.net/jpg/03/85/80/65/240_F_385806572_XMZxLBOiRdDji9eV82GMH4fbMfT1BUaZ.jpg",
      alt: "Power Up Your Day",
      heading: "Power Up Your Day",
      description: "Find reliable power banks and charging accessories for your devices.",
      buttonText: "Shop Power",
      buttonLink: "#" // Replace with actual link
    },
    {
      src: "https://t4.ftcdn.net/jpg/14/73/02/69/240_F_1473026999_UDmkMidGuYGLB6uOfCMzOnVtOaiMuJdx.jpg",
      alt: "Gaming Gear Unleashed",
      heading: "Gaming Gear Unleashed",
      description: "Get the edge with our high-performance gaming headphones and accessories.",
      buttonText: "Shop Gaming",
      buttonLink: "#" // Replace with actual link
    },
  ];

  // Data for the new section with image and text blocks
  const infoBlocks = [
    {
      imageSrc: "https://t4.ftcdn.net/jpg/09/04/25/73/240_F_904257361_v5LbelIE0qL2bzttWpar2a7WA35Oovb3.jpg",
      alt: "Smart Living",
      heading: "Smart Living Solutions",
      description: "Integrate technology seamlessly into your home with our smart devices. Control your lights, temperature, and security with ease.",
      imagePosition: "left" // Image on the left, text on the right
    },
    {
      imageSrc: "https://t3.ftcdn.net/jpg/08/63/72/68/240_F_863726845_uhov3x4NTBzFQV9q7wEYX9ZDTJXyhbe7.jpg",
      alt: "Fitness Tracking",
      heading: "Achieve Your Fitness Goals",
      description: "Track your progress, monitor your health, and stay motivated with our advanced fitness trackers and smartwatches.",
      imagePosition: "right" // Image on the right, text on the left
    },
    {
      imageSrc: "https://t3.ftcdn.net/jpg/11/86/92/70/240_F_1186927017_TQ5l6gSy8yLSyTX40aNg9tHim7gMDFxl.jpg",
      alt: "Portable Sound",
      heading: "Music On The Go",
      description: "Enjoy your favorite music wherever you are with our portable speakers and earbuds. Great sound in a compact design.",
      imagePosition: "left" // Image on the left, text on the right
    },
     {
      imageSrc: "https://t4.ftcdn.net/jpg/06/15/09/01/240_F_615090114_ydIgdMzea01W0yWGPAhXyyWwy11JffFi.jpg",
      alt: "Home Entertainment",
      heading: "Ultimate Home Entertainment",
      description: "Transform your living room into a cinematic experience with our high-quality soundbars and home audio systems.",
      imagePosition: "right" // Image on the right, text on the left
    },
  ];


  return (
    <>

      {/* Main Content Area - No longer using 'container' class or 'section' for cards */}
      <div style={{ paddingTop: '50px' }}> {/* Adjust based on banner height */}

        {/* Main Section with Fullscreen Carousel */}
        <header className="main-section" style={{ marginBottom: '60px' }}>
            <Carousel
              showArrows={true}
              showStatus={false}
              showIndicators={true}
              infiniteLoop={true}
              autoPlay={true}
              interval={5000}
              transitionTime={800}
              stopOnHover={true}
              swipeable={true}
              dynamicHeight={false}
              // Styling is now primarily in CSS
            >
              {carouselImages.map((item, index) => (
                <div key={index}>
                  <img
                    src={item.src}
                    alt={item.alt}
                    // Image styling is now in CSS
                  />
                  {/* Content Overlay */}
                  <div className="slide-content">
                      <h2>{item.heading}</h2>
                      <p>{item.description}</p>
                      {/* Use a regular anchor tag or React Router Link if needed */}
                      <a href={item.buttonLink} className="overlay-button">
                          {item.buttonText}
                      </a>
                  </div>
                </div>
              ))}
            </Carousel>
        </header>

        {/* New Section: Image and Information Blocks */}
        <section className="py-5"> {/* Add padding top and bottom */}
            <div className="container"> {/* Use container for responsive width */}
                <h2 className="text-center mb-5">Explore Our Offerings</h2> {/* Section heading */}
                {infoBlocks.map((block, index) => (
                    <div
                        key={index}
                        // The row container itself is reversed when imagePosition is 'right'
                        className={`row align-items-center mb-5 ${block.imagePosition === 'right' ? 'flex-row-reverse' : ''}`}
                    >
                        {/* This col will contain the image for 'left' position,
                           and the content for 'right' position (due to flex-row-reverse) */}
                        <div className="col-md-6">
                            <img
                                src={block.imageSrc}
                                alt={block.alt}
                                className="img-fluid rounded shadow" // Responsive image, rounded corners, shadow
                            />
                        </div>
                        {/* This col will contain the content for 'left' position,
                           and the image for 'right' position (due to flex-row-reverse) */}
                        <div className="col-md-6">
                            <div className="p-4"> {/* Add padding around text content */}
                                <h3>{block.heading}</h3>
                                <p>{block.description}</p>
                                {/* Optional: Add a button or link */}
                                {/* <a href="#" className="btn btn-primary mt-3">Learn More</a> */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>


      </div>

      {/* Footer Section - Added with inline styles */}
      <footer style={{
        backgroundColor: '#343a40', // Dark background
        color: '#ffffff', // White text
        textAlign: 'center',
        padding: '20px 0',
        fontSize: '0.9rem',
      }}>
        <p>© {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
      </footer>
    </>
  );
}

export default Signup;