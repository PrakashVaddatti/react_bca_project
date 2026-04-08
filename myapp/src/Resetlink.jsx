import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';

function Resetlink() {
  const [searchParams] = useSearchParams();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const encrypted = decodeURIComponent(searchParams.get('userid'));
    console.log(encrypted);

    if (encrypted) {
      try {
        const [ivHex, encryptedHex] = encrypted.split(':');

        const key = CryptoJS.PBKDF2("thisismycodenodejscrypto", CryptoJS.enc.Utf8.parse("my_salt_string"), {
          keySize: 256 / 32,
          iterations: 1000,
          hasher: CryptoJS.algo.SHA256
        });

        const decrypted = CryptoJS.AES.decrypt(
          {
            ciphertext: CryptoJS.enc.Hex.parse(encryptedHex)
          },
          key,
          {
            iv: CryptoJS.enc.Hex.parse(ivHex),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
          }
        );

        const plaintext = decrypted.toString(CryptoJS.enc.Utf8);
        console.log("Decrypted User ID:", plaintext);
        setUserId(plaintext);
      } catch (error) {
        console.error("Decryption failed:", error);
        setErrors({ general: "Invalid or expired reset link" });
      }
    }
  }, [searchParams]);

  const validatePassword = () => {
    const newErrors = {};
    
    // Length validation
    if (password.length < 8) {
      newErrors.length = "Password must be at least 8 characters";
    }
    
    // Letter validation
    if (!/[a-zA-Z]/.test(password)) {
      newErrors.letters = "Password must contain letters";
    }
    
     // Letter validation
     if (!/[A-Z]/.test(password)) {
      newErrors.capitalletters = "Password must contain capitalletters";
    }
    // Digit validation
    if (!/[0-9]/.test(password)) {
      newErrors.digits = "Password must contain numbers";
    }
    
    // Confirm password match
    if (password !== confirmPassword) {
      newErrors.match = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }
    
    try {
      const userpassword = { password };
      const response = await fetch(`http://localhost:5000/resetpassword/${userId}`, {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userpassword)
      });
      
      const result = await response.json();
      
      if (response.status === 200) {
        navigate('/signin', { state: { successMessage: "Password reset successfully!" } });
      } else {
        setErrors({ general: result.message || "Failed to reset password" });
      }
    } catch (error) {
      setErrors({ general: "Network error. Please try again." });
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card shadow-lg" style={{ width: "450px" }}>
        <div className="card-body p-4">
          <h2 className="card-title text-center mb-4 text-primary">
            <i className="fas fa-key me-2"></i>Reset Password
          </h2>
          
          {errors.general && (
            <div className="alert alert-danger">
              {errors.general}
            </div>
          )}
          
          <form onSubmit={submitHandler}>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">New Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className={`form-control ${errors.length || errors.letters ||  errors.capitalletters || errors.digits ? 'is-invalid' : ''}`}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  className="btn btn-outline-secondary" 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`fas fa-eye${showPassword ? '-slash' : ''}`}></i>
                </button>
              </div>
              {errors.length && <div className="invalid-feedback">{errors.length}</div>}
              {errors.letters && <div className="invalid-feedback">{errors.letters}</div>}
              {errors.capitalletters && <div className="invalid-feedback">{errors.capitalletters}</div>}
              {errors.digits && <div className="invalid-feedback">{errors.digits}</div>}
            </div>
            
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                className={`form-control ${errors.match ? 'is-invalid' : ''}`}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {errors.match && <div className="invalid-feedback">{errors.match}</div>}
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary w-100 py-2"
            >
              Reset Password
            </button>
          </form>
          
          <div className="mt-3">
            <small className="text-muted">Password Requirements:</small>
            <ul className="list-unstyled small">
              <li className={password.length >= 8 ? 'text-success' : 'text-muted'}>
                <i className={`fas ${password.length >= 8 ? 'fa-check-circle' : 'fa-circle'} me-2`}></i>
                Minimum 8 characters
              </li>
              <li className={/[a-zA-Z]/.test(password) ? 'text-success' : 'text-muted'}>
                <i className={`fas ${/[a-zA-Z]/.test(password) ? 'fa-check-circle' : 'fa-circle'} me-2`}></i>
                Contains letters
              </li>

              <li className={/[A-Z]/.test(password) ? 'text-success' : 'text-muted'}>
                <i className={`fas ${/[A-Z]/.test(password) ? 'fa-check-circle' : 'fa-circle'} me-2`}></i>
                Contains capitalletters
              </li>

              <li className={/[0-9]/.test(password) ? 'text-success' : 'text-muted'}>
                <i className={`fas ${/[0-9]/.test(password) ? 'fa-check-circle' : 'fa-circle'} me-2`}></i>
                Contains numbers
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Resetlink;