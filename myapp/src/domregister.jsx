import React, { useState } from 'react';
import { Link } from "react-router-dom";
import Citylist from './Citylist';
import Otpverification from './otpverification';
import { useNavigate } from 'react-router-dom';

function Domregister() {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    mobilenumber: "",
    email: "",
    gender: "",
    password: "",
    cityid: "",
    confirmPassword: "",
  });

  const [otpEmail, setOtpEmail] = useState("");
  const [sentotp, setsentotp] = useState(false);
  const [disableRendButton, setdisableresendButton] = useState(true);
  const [timer, setTimer] = useState(120);
  const [message, setMessage] = useState(null); // Use null initially
  const [isLoading, setIsLoading] = useState(false);
  let navigate = useNavigate();

  // Define a more refined color palette
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

  const verifyotp = async (otp) => {
    setIsLoading(true);
    const response = await fetch("http://localhost:5000/verifyotp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailid: formData.email, otp })
    });

    let result = await response.json();
    setIsLoading(false);

    if (response.status === 200) {
      setMessage({ type: 'success', text: result.message || "OTP Verified Successfully!" });
      setTimeout(() => { // Delay navigation slightly to show success message
          navigate('/signin');
      }, 2000); // 2 seconds delay
    } else {
      setMessage({ type: 'danger', text: result.message || "OTP Verification Failed!" });
    }

    if (response.ok) {
      // Reset full form only after OTP is verified
      setFormData({
        fname: "",
        lname: "",
        mobilenumber: "",
        email: "",
        gender: "",
        password: "",
        cityid: "",
        confirmPassword: "",
      });
      setsentotp(false);
    }
  };

  const startTimer = () => {
    setdisableresendButton(true);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setdisableresendButton(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formDataHandler = (e) => {
    const { name, value } = e.target;
    setFormData((existing) => ({
      ...existing,
      [name]: value
    }));
    setMessage(null); // Clear message on input change
  };

  const isValidPassword = (password) => {
    return password.length >= 8
      && /[A-Z]/.test(password)
      && /[a-z]/.test(password)
      && /[0-9]/.test(password);
  };

  
  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null); // Clear previous messages

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'danger', text: "Passwords do not match!" });
      setIsLoading(false);
      return;
    }

    const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailPattern.test(formData.email)) {
      setMessage({ type: 'danger', text: "Please enter a valid email address!" });
      setIsLoading(false);
      return;
    }

    if (!/^\d{10}$/.test(formData.mobilenumber)) {
      setMessage({ type: 'danger', text: "Please enter a valid 10-digit phone number." });
      setIsLoading(false);
      return;
    }

    if (!isValidPassword(formData.password)) {
      setMessage({ type: 'danger', text: "Password must be at least 8 characters long and include uppercase, lowercase, and numbers." });
      setIsLoading(false);
      return;
    }

    let response = await fetch("http://localhost:5000/card", {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    let result = await response.json();
    setIsLoading(false);

    if (response.status === 400) {
      setMessage({ type: 'danger', text: result.message });
    } else if (response.status === 200) {
      setMessage({ type: 'success', text: result.message });
      setOtpEmail(formData.email);
      setsentotp(true);
      setTimer(120);
      startTimer();
    } else {
       setMessage({ type: 'danger', text: result.message || "An unexpected error occurred." });
    }
  };

  const handleCitydata = (cityid) => {
    setFormData((prev) => ({
      ...prev,
      cityid: cityid,
    }));
  };

  // Inline styles for the component
  const pageContainerStyle = {
    background: `linear-gradient(to bottom, ${backgroundColorStart}, ${backgroundColorEnd})`,
    minHeight: '100vh',
    padding: '60px 0', // Increased padding for better spacing
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start', // Align items to the top
  };

  const containerStyle = {
    width: '90%', // Increased width for larger screens
    maxWidth: '700px', // Max width for the card
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
    textAlign: 'left', // Align text left
    outline: 'none', // Remove default outline
  };

  const inputFocusStyle = {
    borderColor: focusBorderColor,
    boxShadow: `0 0 0 0.25rem ${primaryColor}40`, // Softer focus shadow with transparency
    transform: 'scale(1.01)', // Subtle scale up on focus
  };

  const buttonStyle = {
    display: 'block',
    width: '60%', // Adjusted width
    margin: '30px auto 0', // Center the button and add more top margin
    padding: '14px 30px', // Increased padding
    fontSize: '1.2rem', // Larger font size
    fontWeight: 'bold',
    lineHeight: '1.5',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    verticalAlign: 'middle',
    cursor: 'pointer',
    border: 'none', // No border
    borderRadius: '30px', // Very rounded corners
    backgroundColor: primaryColor,
    color: '#fff',
    transition: 'background-color 0.3s ease-in-out, transform 0.1s ease-in-out, box-shadow 0.2s ease-in-out',
    boxShadow: `0 5px 15px ${primaryColor}40`, // Button shadow
    outline: 'none',
  };

  const buttonHoverStyle = {
    backgroundColor: '#5a32ac', // Darker purple on hover
    boxShadow: `0 8px 20px ${primaryColor}60`, // Larger shadow on hover
  };

  const buttonActiveStyle = {
    transform: 'scale(0.98)', // Subtle press effect
    boxShadow: `0 2px 10px ${primaryColor}30`, // Smaller shadow when active
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
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slightly less transparent
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    animation: 'fadeIn 0.3s ease-in-out', // Fade in overlay
  };

  const spinnerContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const spinnerStyle = {
    width: '50px', // Larger spinner
    height: '50px', // Larger spinner
    border: `6px solid rgba(0, 0, 0, 0.1)`, // Thicker border
    borderRadius: '50%',
    borderTopColor: primaryColor, // Primary color for spinner
    animation: 'spin 1s linear infinite', // Linear spin
    marginBottom: '15px',
  };

  const loadingTextStyle = {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: secondaryColor,
  };

  // Define animation keyframes
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

  return (
    <div style={pageContainerStyle}>
      {/* Inject keyframes */}
      <style>{keyframesStyle}</style>

      {isLoading && (
        <div style={loadingOverlayStyle}>
          <div style={spinnerContainerStyle}>
            <div style={spinnerStyle}></div>
            <div style={loadingTextStyle}>Processing...</div>
          </div>
        </div>
      )}

      {!sentotp ? (
        <div style={containerStyle}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}> {/* Increased bottom margin */}
            <h1 style={{ fontSize: '2.8rem', color: primaryColor, marginBottom: '15px', fontWeight: '700' }}>Create Your Account</h1> {/* Larger, bolder heading */}
            <p style={{ fontSize: '1.3rem', color: secondaryColor, fontWeight: '400' }}>Join us for an awesome experience!</p> {/* Larger, lighter subtext */}
          </div>

          {message && (
            <div style={{
              ...messageStyle,
              ...(message.type === 'success' ? messageSuccessStyle : messageDangerStyle),
            }}>
              {message.text}
            </div>
          )}

          <div className="row justify-content-center"> {/* Keep row/col for potential Bootstrap alignment if needed, but mostly using flex/gap */}
            <div className="col-md-12"> {/* Use col-md-12 to make form take full width of the card */}
              <form id="registrationForm" noValidate onSubmit={submitHandler}>
                <div style={{ display: 'flex', gap: '20px', marginBottom: '25px', flexWrap: 'wrap' }}> {/* Allow wrapping on small screens */}
                  <div style={{ flex: 1, minWidth: '250px' }}> {/* Ensure minimum width for flexibility */}
                    <label htmlFor="firstName" style={labelStyle}>First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="fname"
                      placeholder="Enter first name"
                      required
                      value={formData.fname}
                      onChange={formDataHandler}
                      style={inputStyle}
                      onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                      onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                    />
                  </div>

                  <div style={{ flex: 1, minWidth: '250px' }}>
                    <label htmlFor="lastName" style={labelStyle}>Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lname"
                      placeholder="Enter last name"
                      required
                      value={formData.lname}
                      onChange={formDataHandler}
                      style={inputStyle}
                      onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                      onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                    />
                  </div>
                </div>

                <div style={formGroupStyle}>
                  <label htmlFor="mobilenumber" style={labelStyle}>Phone Number <i className="fa-solid fa-phone-volume"></i></label>
                  <input
                    type="text"
                    id="mobilenumber"
                    name="mobilenumber"
                    placeholder="Enter Phone Number"
                    required
                    value={formData.mobilenumber}
                    onChange={formDataHandler}
                    style={inputStyle}
                    onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                  />
                </div>

                <div style={formGroupStyle}>
                  <label htmlFor="email" style={labelStyle}>Email address <i className="fa-solid fa-envelope"></i></label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter email"
                    required
                    value={formData.email}
                    onChange={formDataHandler}
                    style={inputStyle}
                    onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                  />
                </div>

                <div style={formGroupStyle}>
                  {/* You might need to pass styles to the Citylist component's internal select or input */}
                  <label htmlFor="city" style={labelStyle}>City <i className="fa-solid fa-city"></i></label>
                   <Citylist
                       onselectcity={handleCitydata}
                       // Pass inputStyle and focus handlers if Citylist accepts them as props
                       // For example: inputStyle={inputStyle} onFocus={...} onBlur={...}
                   />
                </div>

                <div style={formGroupStyle}>
                  <label htmlFor="gender" style={labelStyle}>Gender <i className="fa-solid fa-venus-mars"></i></label>
                  <select
                    id="gender"
                    name="gender"
                    required
                    value={formData.gender}
                    onChange={formDataHandler}
                    style={{ ...inputStyle, textAlign: 'left', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '16px 12px' }} // Custom dropdown arrow
                    onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={(e) => Object.assign(e.target.style, inputStyle, { appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '16px 12px' })}
                  >
                    <option value="">Select Gender</option>
                    <option value="1">Male</option>
                    <option value="2">Female</option>
                    <option value="3">Other</option>
                  </select>
                </div>

                <div style={formGroupStyle}>
                  <label htmlFor="password" style={labelStyle}>Password <i className="fa-solid fa-key"></i></label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    required
                    value={formData.password}
                    onChange={formDataHandler}
                    style={inputStyle}
                    onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                  />
                </div>

                <div style={formGroupStyle}>
                  <label htmlFor="confirmPassword" style={labelStyle}>Confirm Password <i className="fa-solid fa-lock"></i></label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Re-enter Password"
                    required
                    value={formData.confirmPassword}
                    onChange={formDataHandler}
                    style={inputStyle}
                    onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                  />
                  {formData.confirmPassword && formData.confirmPassword !== formData.password && (
                    <small style={{ display: 'block', marginTop: '5px', color: dangerColor, fontSize: '0.9rem' }}>Passwords do not match</small>
                  )}
                </div>

                <button
                  type="submit"
                  style={buttonStyle}
                  onMouseOver={(e) => Object.assign(e.target.style, {...buttonStyle, ...buttonHoverStyle})}
                  onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}
                  onMouseDown={(e) => Object.assign(e.target.style, {...buttonStyle, ...buttonActiveStyle})}
                  onMouseUp={(e) => Object.assign(e.target.style, {...buttonStyle, ...buttonHoverStyle})} // Return to hover state on mouse up
                >
                  Register
                </button>
              </form>
              <p style={{ marginTop: '30px', textAlign: 'center', fontSize: '1rem', color: secondaryColor }}>
                Already have an account? <Link to="/signin" style={linkStyle} onMouseOver={(e) => Object.assign(e.target.style, {...linkStyle, ...linkHoverStyle})} onMouseOut={(e) => Object.assign(e.target.style, linkStyle)}>Login</Link>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <Otpverification
          timer={timer}
          verifyotp={verifyotp}
          disableRendButton={disableRendButton}
          // Pass down some styles to Otpverification if it's a custom component
          // For example: inputStyle={inputStyle} buttonStyle={buttonStyle}
        />
      )}
    </div>
  );
}

export default Domregister;