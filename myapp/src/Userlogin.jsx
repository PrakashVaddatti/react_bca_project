import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Userlogin({ updaterole }) { // Added updaterole prop if needed
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState(null); // State for messages
    const [isLoading, setIsLoading] = useState(false); // State for loading
    const navigate = useNavigate();

    // Define the same color palette and styles
    const primaryColor = '#6f42c1'; // A deep purple
    const secondaryColor = '#6c757d';
    const successColor = '#28a745';
    const dangerColor = '#dc3545';
    const backgroundColorStart = '#e9ecef'; // Light gray for gradient start
    const backgroundColorEnd = '#dee2e6'; // Slightly darker gray for gradient end
    const cardColor = '#ffffff';
    const borderColor = '#ced4da';
    const focusBorderColor = primaryColor; // Use primary color for focus

    const pageContainerStyle = {
        background: `linear-gradient(to bottom, ${backgroundColorStart}, ${backgroundColorEnd})`,
        minHeight: '100vh',
        padding: '60px 0', // Increased padding
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center', // Center vertically
    };

    const containerStyle = {
        width: '90%', // Increased width
        maxWidth: '500px', // Max width for a login card
        padding: '40px', // Increased padding
        backgroundColor: cardColor,
        borderRadius: '20px', // More rounded corners
        boxShadow: `0 15px 30px rgba(0, 0, 0, 0.15), 0 5px 15px rgba(0, 0, 0, 0.1)`, // Softer, larger shadow
        transition: 'transform 0.3s ease-in-out',
        transform: isLoading ? 'scale(0.98)' : 'scale(1)', // Subtle scale down when loading
        position: 'relative', // Needed for loading overlay
    };

    const headerStyle = {
        textAlign: 'center',
        marginBottom: '30px', // Increased margin
    };

    const headingStyle = {
        fontSize: '2.5rem', // Larger heading
        color: primaryColor,
        marginBottom: '10px',
        fontWeight: '700',
    };

    const subHeadingStyle = {
        fontSize: '1.1rem', // Larger subtext
        color: secondaryColor,
        fontWeight: '400',
    };

    const formGroupStyle = {
        marginBottom: '25px', // Increased bottom margin
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '10px', // Increased bottom margin
        fontWeight: '600',
        color: secondaryColor,
        fontSize: '1rem',
    };

    const inputStyle = {
        display: 'block',
        width: '100%',
        padding: '14px 18px', // Increased padding
        fontSize: '1rem',
        lineHeight: '1.5',
        color: '#495057',
        backgroundColor: '#fff',
        backgroundClip: 'padding-box',
        border: `1px solid ${borderColor}`,
        borderRadius: '10px', // More rounded input fields
        transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out',
        outline: 'none',
    };

    const inputFocusStyle = {
        borderColor: focusBorderColor,
        boxShadow: `0 0 0 0.25rem ${primaryColor}40`, // Softer focus shadow
        transform: 'scale(1.01)', // Subtle scale up
    };

    const buttonStyle = {
        display: 'block',
        width: '100%',
        padding: '14px 30px', // Increased padding
        fontSize: '1.2rem', // Larger font size
        fontWeight: 'bold',
        lineHeight: '1.5',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        verticalAlign: 'middle',
        cursor: 'pointer',
        border: 'none',
        borderRadius: '30px', // Very rounded corners
        backgroundColor: primaryColor,
        color: '#fff',
        transition: 'background-color 0.3s ease-in-out, transform 0.1s ease-in-out, box-shadow 0.2s ease-in-out',
        boxShadow: `0 5px 15px ${primaryColor}40`,
        outline: 'none',
        marginBottom: '15px', // Added margin below the main button
    };

    const buttonHoverStyle = {
        backgroundColor: '#5a32ac', // Darker purple on hover
        boxShadow: `0 8px 20px ${primaryColor}60`,
    };

    const buttonActiveStyle = {
        transform: 'scale(0.98)', // Subtle press effect
        boxShadow: `0 2px 10px ${primaryColor}30`,
    };

    const disabledButtonStyle = {
        opacity: 0.65,
        cursor: 'not-allowed',
        boxShadow: 'none',
    };

    const linkStyle = {
        color: primaryColor,
        textDecoration: 'none',
        fontWeight: '600',
        transition: 'color 0.2s ease-in-out, text-decoration 0.2s ease-in-out',
    };

    const linkHoverStyle = {
        color: '#5a32ac', // Darker purple on hover
        textDecoration: 'underline',
    };

    const alertStyle = {
        padding: '15px',
        marginBottom: '25px', // Adjust margin below the alert
        borderRadius: '8px', // Slightly less rounded than card
        textAlign: 'center',
        fontWeight: '600',
        fontSize: '1rem',
        border: '1px solid transparent', // Add a border
        animation: 'fadeIn 0.5s ease-in-out', // Keep fade in animation
    };

    const alertSuccessStyle = {
        color: '#0f5132', // Dark green text
        backgroundColor: '#d1e7dd', // Light green background
        borderColor: '#badbcc', // Green border
    };

    const alertDangerStyle = {
        color: '#842029', // Dark red text
        backgroundColor: '#f8d7da', // Light red background
        borderColor: '#f5c2c7', // Red border
    };

    // --- Loading Design Styles ---
    const loadingOverlayStyle = {
        position: 'absolute', // Position relative to the card
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // White overlay with transparency
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10, // Ensure it's above other content in the card
        borderRadius: '20px', // Match card border radius
        animation: 'fadeIn 0.3s ease-in-out', // Fade in overlay
        // Initially hidden, displayed when isLoading is true
        visibility: isLoading ? 'visible' : 'hidden',
        opacity: isLoading ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out, visibility 0.3s ease-in-out',
    };

    const spinnerContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    };

    const spinnerStyle = {
        width: '50px', // Spinner size
        height: '50px', // Spinner size
        border: `6px solid rgba(0, 0, 0, 0.1)`, // Spinner border thickness and color
        borderRadius: '50%',
        borderTopColor: primaryColor, // Primary color for the spinning part
        animation: 'spin 1s linear infinite', // Apply the spin animation
        marginBottom: '15px', // Space between spinner and text
    };

    const loadingTextStyle = {
        fontSize: '1.1rem', // Slightly larger text
        fontWeight: 'bold',
        color: secondaryColor, // Use secondary color for text
    };
    // --- End Loading Design Styles ---

    // --- Social Button Styles ---
    const socialButtonContainerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '25px',
    };

    const socialButtonStyle = {
        flex: '1', // Distribute space evenly
        margin: '0 5px', // Add space between buttons
        padding: '12px 20px',
        fontSize: '1rem',
        fontWeight: '600',
        border: `1px solid ${borderColor}`,
        borderRadius: '8px',
        backgroundColor: '#fff',
        color: secondaryColor,
        cursor: 'pointer',
        transition: 'background-color 0.2s ease-in-out, border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const socialButtonHoverStyle = {
        backgroundColor: '#f8f9fa',
        borderColor: '#ced4da',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
    };

    const socialButtonIconStyle = {
        marginRight: '10px',
        fontSize: '1.2rem',
    };
    // --- End Social Button Styles ---


    // Define animation keyframes (can be shared or defined here)
    const keyframesStyle = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
     `;


    const dataHandler = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setMessage(null); // Clear message on input change
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Start loading
        setMessage(null); // Clear previous messages

        try {
            let response = await fetch("http://localhost:5000/userlogin", {
                method: 'POST',
                headers: { "Content-Type": "application/JSON" },
                body: JSON.stringify(formData)
            });

            let result = await response.json();
            setIsLoading(false); // Stop loading

            if (response.status === 200) {
                localStorage.setItem("token", result.token);
                localStorage.setItem("role", result.role);
                localStorage.setItem("email", result.email);
                updaterole(result.role); // Uncomment if you pass and use updaterole prop
                setMessage({ type: 'success', text: result.message || "Login Successful!" });

                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                if (cart.length > 0) {
                    let response = await fetch("http://localhost:5000/addtocarts", {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/JSON",
                            'Authorization': `Bearer ${localStorage.getItem("token")}`
                        },
                        body: JSON.stringify(cart),
                    });
                    let result = await response.json()
                    if (response.status == 200) {
                        localStorage.removeItem("cart")
                    }
                    alert(result.message)
                    // navigate('/Productscard')
                }

                // Delay navigation slightly to show success message
                setTimeout(() => {

                    navigate('/Productscard');

                }); // 1.5 seconds delay

            } else {
                setMessage({ type: 'danger', text: result.message || "Login Failed. Please check your email and password." });
            }
        } catch (error) {
            setIsLoading(false); // Stop loading on error
            console.error("Login error:", error);
            setMessage({ type: 'danger', text: "An error occurred during login. Please try again." });
        }
    };


    return (
        <div style={pageContainerStyle}>
            {/* Inject keyframes */}
            <style>{keyframesStyle}</style>

            <div style={containerStyle}>
                {/* --- Loading Overlay and Spinner --- */}
                <div style={loadingOverlayStyle}>
                    <div style={spinnerContainerStyle}>
                        <div style={spinnerStyle}></div>
                        <div style={loadingTextStyle}>Logging in...</div>
                    </div>
                </div>
                {/* --- End Loading Overlay and Spinner --- */}

                <div style={headerStyle}>
                    <h3 style={headingStyle}>Welcome Back</h3>
                    <p style={subHeadingStyle}>Please log in to your account.</p>
                </div>

                {message && (
                    <div style={{
                        ...alertStyle, // Apply base alert styles
                        ...(message.type === 'success' ? alertSuccessStyle : alertDangerStyle), // Apply type-specific styles
                    }}>
                        {message.text}
                    </div>
                )}

                {/* Social Buttons */}
                <div style={socialButtonContainerStyle}>
                    <button
                        type="button" // Changed to type="button" as they don't submit the form
                        style={socialButtonStyle}
                        onMouseOver={(e) => Object.assign(e.target.style, { ...socialButtonStyle, ...socialButtonHoverStyle })}
                        onMouseOut={(e) => Object.assign(e.target.style, socialButtonStyle)}
                    >
                        <i className="fab fa-google" style={socialButtonIconStyle}></i> Google
                    </button>
                    <button
                        type="button" // Changed to type="button"
                        style={{ ...socialButtonStyle, marginLeft: '10px' }} // Add more space between buttons
                        onMouseOver={(e) => Object.assign(e.target.style, { ...socialButtonStyle, ...socialButtonHoverStyle, marginLeft: '10px' })}
                        onMouseOut={(e) => Object.assign(e.target.style, { ...socialButtonStyle, marginLeft: '10px' })}
                    >
                        <i className="fab fa-facebook-f" style={socialButtonIconStyle}></i> Facebook
                    </button>
                </div>


                <form onSubmit={submitHandler}>
                    <div style={formGroupStyle}>
                        <label htmlFor="formBasicEmail" style={labelStyle}>Email Address</label>
                        <input
                            type="text"
                            name="email"
                            // className="form-control" // Removed Bootstrap class to rely on inline styles
                            onChange={dataHandler}
                            id="formBasicEmail"
                            placeholder="Enter email"
                            required
                            style={inputStyle}
                            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                            onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                        />
                    </div>
                    <div style={formGroupStyle}>
                        <label htmlFor="formBasicPassword" style={labelStyle}>Password</label>
                        <input
                            type="password"
                            name="password"
                            onChange={dataHandler}
                            // className="form-control" // Removed Bootstrap class
                            id="formBasicPassword"
                            placeholder="Password"
                            required
                            style={inputStyle}
                            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                            onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading} // Disable button when loading
                        style={{
                            ...buttonStyle,
                            ...(isLoading ? disabledButtonStyle : {}), // Apply disabled style
                        }}
                        onMouseOver={(e) => isLoading ? null : Object.assign(e.target.style, { ...buttonStyle, ...buttonHoverStyle })}
                        onMouseOut={(e) => isLoading ? null : Object.assign(e.target.style, buttonStyle)}
                        onMouseDown={(e) => isLoading ? null : Object.assign(e.target.style, { ...buttonStyle, ...buttonActiveStyle })}
                        onMouseUp={(e) => isLoading ? null : Object.assign(e.target.style, { ...buttonStyle, ...buttonHoverStyle })}
                    >
                        {isLoading ? 'Logging In...' : 'Log In'} {/* Change button text when loading */}
                    </button>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '25px', // Increased margin below links
                    }}>
                        <Link
                            to="/forgetpwd"
                            style={linkStyle}
                            onMouseOver={(e) => Object.assign(e.target.style, { ...linkStyle, ...linkHoverStyle })}
                            onMouseOut={(e) => Object.assign(e.target.style, linkStyle)}
                        >
                            Forgot password?
                        </Link>
                        {/* Empty div or span to push forgot password to the left if needed */}
                        <div></div>
                    </div>


                    <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '1rem', color: secondaryColor }}>
                        <span>Don’t have an account? </span>
                        <Link
                            to="/Register"
                            style={linkStyle}
                            onMouseOver={(e) => Object.assign(e.target.style, { ...linkStyle, ...linkHoverStyle })}
                            onMouseOut={(e) => Object.assign(e.target.style, linkStyle)}
                        >
                            Sign up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Userlogin;