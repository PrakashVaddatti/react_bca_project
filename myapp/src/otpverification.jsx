import React, { useState, useEffect } from 'react';

function Otpverification({ disableRendButton, timer, verifyotp, onEditEmail, message, isLoading }) { // Added onEditEmail, message, isLoading props

    let [otp, setotp] = useState("");

    // Define the same color palette and styles as in Domregister
    const primaryColor = '#6f42c1'; // A deep purple
    const secondaryColor = '#6c757d';
    const successColor = '#28a745';
    const dangerColor = '#dc3545';
    const warningColor = '#ffc107';
    const backgroundColorStart = '#e9ecef'; // Light gray for gradient start
    const backgroundColorEnd = '#dee2e6'; // Slightly darker gray for gradient end
    const cardColor = '#ffffff';
    const borderColor = '#ced4da';
    const focusBorderColor = primaryColor; // Use primary color for focus

    const containerStyle = {
        width: '90%', // Increased width for larger screens
        maxWidth: '500px', // Max width for the card
        padding: '40px', // Increased padding
        backgroundColor: cardColor,
        borderRadius: '20px', // More rounded corners
        boxShadow: `0 15px 30px rgba(0, 0, 0, 0.15), 0 5px 15px rgba(0, 0, 0, 0.1)`, // Softer, larger shadow
        transition: 'transform 0.3s ease-in-out',
        transform: isLoading ? 'scale(0.98)' : 'scale(1)', // Subtle scale down when loading
    };

     const formGroupStyle = {
        marginBottom: '25px', // Increased bottom margin
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '10px', // Increased bottom margin
        fontWeight: '600', // Slightly bolder font
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
        textAlign: 'center', // Center text for OTP input
        outline: 'none', // Remove default outline
        letterSpacing: '0.2em', // Add spacing between OTP digits
    };

    const inputFocusStyle = {
        borderColor: focusBorderColor,
        boxShadow: `0 0 0 0.25rem ${primaryColor}40`, // Softer focus shadow with transparency
        transform: 'scale(1.01)', // Subtle scale up on focus
    };

    const buttonStyle = {
        display: 'block',
        width: '100%', // Full width buttons
        padding: '12px 20px', // Slightly less padding than register button
        fontSize: '1.1rem', // Slightly smaller font size
        fontWeight: 'bold',
        lineHeight: '1.5',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        verticalAlign: 'middle',
        cursor: 'pointer',
        border: 'none', // No border
        borderRadius: '30px', // Very rounded corners
        transition: 'background-color 0.3s ease-in-out, transform 0.1s ease-in-out, box-shadow 0.2s ease-in-out',
        outline: 'none',
        marginTop: '15px', // Add margin between buttons
    };

    const primaryButtonStyle = {
        ...buttonStyle,
        backgroundColor: primaryColor,
        color: '#fff',
        boxShadow: `0 5px 15px ${primaryColor}40`, // Button shadow
    };

    const primaryButtonHoverStyle = {
        backgroundColor: '#5a32ac', // Darker purple on hover
        boxShadow: `0 8px 20px ${primaryColor}60`, // Larger shadow on hover
    };

    const primaryButtonActiveStyle = {
        transform: 'scale(0.98)', // Subtle press effect
        boxShadow: `0 2px 10px ${primaryColor}30`, // Smaller shadow when active
    };

    const secondaryButtonStyle = {
        ...buttonStyle,
        backgroundColor: secondaryColor,
        color: '#fff',
        boxShadow: `0 5px 15px ${secondaryColor}40`,
    };

     const secondaryButtonHoverStyle = {
        backgroundColor: '#5a6268',
        boxShadow: `0 8px 20px ${secondaryColor}60`,
    };

     const secondaryButtonActiveStyle = {
        transform: 'scale(0.98)',
        boxShadow: `0 2px 10px ${secondaryColor}30`,
    };


     const warningButtonStyle = {
        ...buttonStyle,
        backgroundColor: warningColor,
        color: '#212529', // Dark text for warning color
        boxShadow: `0 5px 15px ${warningColor}40`,
    };

     const warningButtonHoverStyle = {
        backgroundColor: '#e0a800',
        boxShadow: `0 8px 20px ${warningColor}60`,
    };

     const warningButtonActiveStyle = {
        transform: 'scale(0.98)',
        boxShadow: `0 2px 10px ${warningColor}30`,
    };

    const disabledButtonStyle = {
        opacity: 0.65,
        cursor: 'not-allowed',
        boxShadow: 'none',
    };

    const messageStyle = {
        padding: '15px 25px', // Increased padding
        marginBottom: '30px', // Increased bottom margin
        borderRadius: '10px', // Rounded corners
        textAlign: 'center',
        fontWeight: '600',
        fontSize: '1rem',
        animation: 'fadeIn 0.5s ease-in-out', // Fade in animation
    };

    const messageSuccessStyle = {
        backgroundColor: successColor,
        color: '#fff',
    };

    const messageDangerStyle = {
        backgroundColor: dangerColor,
        color: '#fff',
    };

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
        zIndex: 10, // Above other content in the card
        borderRadius: '20px', // Match card border radius
        animation: 'fadeIn 0.3s ease-in-out', // Fade in overlay
     };

     const spinnerContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
     };

     const spinnerStyle = {
        width: '40px', // Slightly smaller spinner for inside card
        height: '40px', // Slightly smaller spinner
        border: `5px solid rgba(0, 0, 0, 0.1)`, // Slightly thinner border
        borderRadius: '50%',
        borderTopColor: primaryColor, // Primary color for spinner
        animation: 'spin 1s linear infinite', // Linear spin
        marginBottom: '10px',
     };

     const loadingTextStyle = {
        fontSize: '1rem',
        fontWeight: 'bold',
        color: secondaryColor,
     };

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


    const submitHandler = (e) => {
        e.preventDefault();
        if (otp) { // Only call verifyotp if OTP is entered
            verifyotp(otp);
        }
    };

    // Effect to potentially trigger resend logic or update UI based on timer
    useEffect(() => {
        // No action needed here for the timer display itself, as it's handled by the parent.
        // This could be used for side effects related to the timer if needed.
    }, [timer]); // Re-run if timer changes

    return (
        <div className="d-flex justify-content-center align-items-center vh-100" style={{
             background: `linear-gradient(to bottom, ${backgroundColorStart}, ${backgroundColorEnd})`,
             minHeight: '100vh',
             padding: '60px 0',
        }}>
             {/* Inject keyframes */}
             <style>{keyframesStyle}</style>

            <div style={{...containerStyle, position: 'relative'}}> {/* Add position relative for loading overlay */}
                <div style={{ textAlign: 'center', marginBottom: '30px' }}> {/* Slightly less margin */}
                    <h5 style={{ fontSize: '2rem', color: primaryColor, marginBottom: '10px', fontWeight: '700' }}>Verify Your Email</h5> {/* Larger, bolder heading */}
                    <p style={{ fontSize: '1.1rem', color: secondaryColor, fontWeight: '400' }}>Please enter the 6-digit code sent to your email.</p> {/* Larger, lighter subtext */}
                </div>

                {message && (
                    <div style={{
                        ...messageStyle,
                        ...(message.type === 'success' ? messageSuccessStyle : messageDangerStyle),
                    }}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={submitHandler}>
                    <div style={formGroupStyle}>
                        <label htmlFor="otp" style={labelStyle}>OTP <i className="fa-solid fa-key"></i></label>
                        <input
                            type="text"
                            id="otp"
                            name="otp"
                            maxLength="6" // Limit input to 6 digits
                            onChange={(e) => setotp(e.target.value)}
                            value={otp} // Bind value to state
                            placeholder="ENTER 6 DIGITS OTP"
                            required
                            style={inputStyle}
                            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                            onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                        />
                    </div>

                    <div style={formGroupStyle}>
                        <button
                            type="submit"
                            disabled={!otp || isLoading} // Disable if OTP is empty or loading
                            style={{
                                ...primaryButtonStyle,
                                ...((!otp || isLoading) ? disabledButtonStyle : {}), // Apply disabled style
                            }}
                             onMouseOver={(e) => (!otp || isLoading) ? null : Object.assign(e.target.style, {...primaryButtonStyle, ...primaryButtonHoverStyle})}
                             onMouseOut={(e) => (!otp || isLoading) ? null : Object.assign(e.target.style, primaryButtonStyle)}
                             onMouseDown={(e) => (!otp || isLoading) ? null : Object.assign(e.target.style, {...primaryButtonStyle, ...primaryButtonActiveStyle})}
                             onMouseUp={(e) => (!otp || isLoading) ? null : Object.assign(e.target.style, {...primaryButtonStyle, ...primaryButtonHoverStyle})}
                        >
                            <i className="fas fa-check"></i> Verify OTP
                        </button>
                    </div>

                    <div style={formGroupStyle}>
                         <button
                             type="button"
                             disabled={disableRendButton || isLoading} // Disable if timer is running or loading
                             // You'll need to add an onClick handler here to trigger resend OTP in the parent component
                             style={{
                                 ...secondaryButtonStyle,
                                 ...(disableRendButton || isLoading ? disabledButtonStyle : {}),
                             }}
                             onMouseOver={(e) => (disableRendButton || isLoading) ? null : Object.assign(e.target.style, {...secondaryButtonStyle, ...secondaryButtonHoverStyle})}
                             onMouseOut={(e) => (disableRendButton || isLoading) ? null : Object.assign(e.target.style, secondaryButtonStyle)}
                             onMouseDown={(e) => (disableRendButton || isLoading) ? null : Object.assign(e.target.style, {...secondaryButtonStyle, ...secondaryButtonActiveStyle})}
                             onMouseUp={(e) => (disableRendButton || isLoading) ? null : Object.assign(e.target.style, {...secondaryButtonStyle, ...secondaryButtonHoverStyle})}
                         >
                             <i className="fas fa-paper-plane"></i>
                             {disableRendButton ? `Resend OTP in ${timer}s` : 'Resend OTP'}
                         </button>
                    </div>

                    <div style={formGroupStyle}>
                         <button
                             type="button"
                             onClick={onEditEmail} // Call the prop function to handle edit
                             disabled={isLoading} // Disable if loading
                             style={{
                                 ...warningButtonStyle,
                                 ...(isLoading ? disabledButtonStyle : {}),
                             }}
                             onMouseOver={(e) => isLoading ? null : Object.assign(e.target.style, {...warningButtonStyle, ...warningButtonHoverStyle})}
                             onMouseOut={(e) => isLoading ? null : Object.assign(e.target.style, warningButtonStyle)}
                             onMouseDown={(e) => isLoading ? null : Object.assign(e.target.style, {...warningButtonStyle, ...warningButtonActiveStyle})}
                             onMouseUp={(e) => isLoading ? null : Object.assign(e.target.style, {...warningButtonStyle, ...warningButtonHoverStyle})}
                         >
                             <i className="fas fa-edit"></i> Edit Email
                         </button>
                    </div>
                </form>

                {isLoading && (
                    <div style={loadingOverlayStyle}>
                        <div style={spinnerContainerStyle}>
                            <div style={spinnerStyle}></div>
                            <div style={loadingTextStyle}>Verifying...</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Otpverification;