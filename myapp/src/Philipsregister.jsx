import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Philipsregister.css';

function Philipsregister() {

  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [mobilenumber, setMobilenumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (!fname.trim()) newErrors.fname = "Fill Proper first Name is required";
    if (!lname.trim()) newErrors.lname = "Last name is required";
    if (!mobilenumber.match(/^\d{10}$/)) newErrors.mobilenumber = "Enter a valid 10-digit mobile number";
    if (!email.match(/^\S+@\S+\.\S+$/)) newErrors.email = "Enter a valid email address";
    if (!passwordRegex.test(password)) newErrors.password = "Password must be at least 6 characters long";
    if (!gender) newErrors.gender = "Please select a gender";
    if (!isChecked) newErrors.isChecked = "You must accept the terms to proceed";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    let userDetails = { fname, lname, mobilenumber, email, password, gender };
    let response = await fetch("http://localhost:5000/card", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userDetails)
    });
    let result = await response.json();
    alert(result.message);

    setFname("");
    setLname("");
    setMobilenumber("");
    setEmail("");
    setPassword("");
    setGender("");
    setIsChecked(false);
    setErrors({});
  };

  return (
    <>

      <div className="form-container">
        <h2>Create your account</h2>

        <div className="Container">
          <form id="registrationForm" onSubmit={submitHandler} className="registration-form">

            <input className={`text-center ${errors.fname ? 'input-error' : ''}`}
              type="text"
              id="firstName"
              placeholder={errors.fname || "FIRST NAME*"}
              value={fname}
              onChange={(e) => setFname(e.target.value)} />


            <input className={`text-center ${errors.lname ? 'input-error' : ''}`}
              type="text"
              id="lastname"
              placeholder={errors.lname || "LAST NAME*"}
              value={lname}
              onChange={(e) => setLname(e.target.value)} />

            <input className={`text-center ${errors.mobilenumber ? 'input-error' : ''}`}
              type="Number"
              id="mobilenumber"
              placeholder={errors.mobilenumber || "MOBILE NUMBER*"}
              value={mobilenumber}
              onChange={(e) => setMobilenumber(e.target.value)} />

            <input className={`text-center ${errors.email ? 'input-error' : ''}`}
              type="email"
              id="email"
              placeholder={errors.email || "EMAIL*"}
              value={email}
              onChange={(e) => setEmail(e.target.value)} />

            <input className={`text-center ${errors.password ? 'input-error' : ''}`}
              type="password"
              id="password"
              placeholder={errors.password || "PASSWORD*"}
              value={password}
              onChange={(e) => setPassword(e.target.value)} />

            <select className={`text-center ${errors.gender ? 'input-error' : ''}`}
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)} >
              <option value="">GENDER</option>
              <option value="1">Male</option>
              <option value="2">Female</option>
              <option value="3">Other</option>
            </select>

            <div className="checkbox-container">
              <label className="checkbox-label">
                <input type="checkbox" checked={isChecked} onChange={() => setIsChecked(!isChecked)} />
                <span>
                  Sign up and get access to exclusive offers and content just for you<br />
                  You must accept the terms to proceed
                </span>
              </label>
            </div>



            <button type="submit" className="submit-btn">Create Account</button>
            <p className="login-link">
              Already have an account? <Link to="#">Login</Link>
            </p>
          </form>
        </div>
      </div>

    </>
  );
}

export default Philipsregister;
