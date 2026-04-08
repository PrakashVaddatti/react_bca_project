import React, { useState } from 'react';

function Forgetpwd() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(null); // State for messages
    const [isLoading, setIsLoading] = useState(false); // State for loading

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


    const submitHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Start loading
        setMessage(null); // Clear previous messages

        let userEmail = {
            email: email
        };

        try {
            let response = await fetch("http://localhost:5000/forgetpwd", {
                method: 'POST',
                headers: { "Content-Type": "application/JSON" },
                body: JSON.stringify(userEmail)
            });

            let result = await response.json();
            setIsLoading(false); // Stop loading

            if (response.status === 200) {
                setMessage({ type: 'success', text: result.message || "Password reset link sent to your email." });
                setEmail(""); // Clear the input field on success
            } else {
                setMessage({ type: 'danger', text: result.message || "Failed to send password reset link." });
            }
        } catch (error) {
             setIsLoading(false); // Stop loading on error
             console.error("Forget password error:", error);
             setMessage({ type: 'danger', text: "An error occurred. Please try again." });
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
                         <div style={loadingTextStyle}>Sending link...</div>
                     </div>
                 </div>
                 {/* --- End Loading Overlay and Spinner --- */}

                <div style={headerStyle}>
                    <h3 style={headingStyle}>Forgot Password</h3>
                    {/* <p style={subHeadingStyle}>Enter your email to receive a reset link.</p> */} {/* Optional subtext */}
                </div>

                {message && (
                     <div style={{
                         ...alertStyle, // Apply base alert styles
                         ...(message.type === 'success' ? alertSuccessStyle : alertDangerStyle), // Apply type-specific styles
                     }}>
                         {message.text}
                     </div>
                 )}

                <form onSubmit={submitHandler}>
                    <div style={{...inputStyle, marginBottom: '25px', padding: '0'}}> {/* Apply input style properties to the container */}
                         <input
                            type='email' // Use type="email" for better validation
                            name='email'
                            onChange={(e)=> setEmail(e.target.value)}
                            value={email} // Bind value to state
                            required
                            placeholder='Enter Email ID'
                            style={{...inputStyle, border: 'none', outline: 'none', boxShadow: 'none', transition: 'none'}} // Reset input style properties to inherit from parent div
                             onFocus={(e) => Object.assign(e.target.parentNode.style, inputFocusStyle)} // Apply focus style to parent div
                             onBlur={(e) => Object.assign(e.target.parentNode.style, {...inputStyle, marginBottom: '25px', padding: '0'})} // Apply blur style to parent div
                         />
                    </div>

                    <button
                         type='submit'
                         disabled={isLoading} // Disable button when loading
                         style={{
                             ...buttonStyle,
                             ...(isLoading ? disabledButtonStyle : {}), // Apply disabled style
                         }}
                         onMouseOver={(e) => isLoading ? null : Object.assign(e.target.style, {...buttonStyle, ...buttonHoverStyle})}
                         onMouseOut={(e) => isLoading ? null : Object.assign(e.target.style, buttonStyle)}
                         onMouseDown={(e) => isLoading ? null : Object.assign(e.target.style, {...buttonStyle, ...buttonActiveStyle})}
                         onMouseUp={(e) => isLoading ? null : Object.assign(e.target.style, {...buttonStyle, ...buttonHoverStyle})}
                    >
                         {isLoading ? 'Sending...' : 'Send Reset Link'} {/* Change button text when loading */}
                    </button>

                </form>
            </div>
        </div>
    );
}

export default Forgetpwd;