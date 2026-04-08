import React, { useEffect, useState } from "react";

const genderMap = {
  Male: "Male",
  Female: "Female",
  Other: "Other",
};

function OrdersPage() {
  const [userData, setUserData] = useState(null);
  const [cityList, setCityList] = useState([]);
  const [cityName, setCityName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  const userEmail = localStorage.getItem("email");

  useEffect(() => {
    fetch(`http://localhost:5000/profile?email=${encodeURIComponent(userEmail)}`)
      .then(res => res.json())
      .then(data => {
        setUserData(data);
        setEditData(data);
      })
      .catch(() => setError("Failed to load profile"));
  }, [userEmail]);

  useEffect(() => {
    fetch("http://localhost:5000/citylist")
      .then(res => res.json())
      .then(setCityList);
  }, []);

  useEffect(() => {
    if (userData && cityList.length) {
      const city = cityList.find(c => c.cityid === userData.cityid);
      setCityName(city?.cityname || "Unknown");
      setLoading(false);
    }
  }, [userData, cityList]);

  const handleChange = e =>
    setEditData({ ...editData, [e.target.name]: e.target.value });

  const handleSave = () => {
    fetch(`http://localhost:5000/update-profile/${userData.userid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    })
      .then(() => {
        setUserData(editData);
        setIsEditing(false);
      });
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.avatar}>
            {userData.fname.charAt(0).toUpperCase()}
          </div>
          <h2>{userData.fname} {userData.lname}</h2>
          <p>{userData.email}</p>
        </div>

        {/* Body */}
        <div style={styles.body}>
          {[
            ["First Name", "fname"],
            ["Last Name", "lname"],
            ["Mobile", "mobilenumber"],
            ["Email", "email"]
          ].map(([label, key]) => (
            <div style={styles.row} key={key}>
              <span>{label}</span>
              {isEditing ? (
                <input
                  name={key}
                  value={editData[key]}
                  onChange={handleChange}
                />
              ) : (
                <strong>{userData[key]}</strong>
              )}
            </div>
          ))}

          {/* City */}
          <div style={styles.row}>
            <span>City</span>
            {isEditing ? (
              <select name="cityid" value={editData.cityid} onChange={handleChange}>
                {cityList.map(c => (
                  <option key={c.cityid} value={c.cityid}>{c.cityname}</option>
                ))}
              </select>
            ) : (
              <strong>{cityName}</strong>
            )}
          </div>

          {/* Gender */}
          <div style={styles.row}>
            <span>Gender</span>
            {isEditing ? (
              <select name="gender" value={editData.gender} onChange={handleChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <strong>{genderMap[userData.gender]}</strong>
            )}
          </div>

          {/* Buttons */}
          <div style={styles.actions}>
            {isEditing ? (
              <>
                <button style={styles.save} onClick={handleSave}>Save</button>
                <button style={styles.cancel} onClick={() => setIsEditing(false)}>Cancel</button>
              </>
            ) : (
              <button style={styles.edit} onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;

/* ===== STYLES ===== */
const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f6f8",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "420px",
    background: "#fff",
    borderRadius: "14px",
    boxShadow: "0 10px 30px rgba(0,0,0,.1)",
    overflow: "hidden",
  },
  header: {
    background: "linear-gradient(135deg,#4facfe,#00f2fe)",
    color: "#fff",
    textAlign: "center",
    padding: "30px",
  },
  avatar: {
    width: "90px",
    height: "90px",
    background: "#fff",
    color: "#4facfe",
    borderRadius: "50%",
    margin: "0 auto 10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "36px",
    fontWeight: "bold",
  },
  body: {
    padding: "25px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "15px",
    alignItems: "center",
  },
  actions: {
    textAlign: "center",
    marginTop: "20px",
  },
  edit: {
    background: "#2196F3",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
  },
  save: {
    background: "#4CAF50",
    color: "#fff",
    padding: "10px 18px",
    border: "none",
    borderRadius: "6px",
    marginRight: "10px",
  },
  cancel: {
    background: "#f44336",
    color: "#fff",
    padding: "10px 18px",
    border: "none",
    borderRadius: "6px",
  },
};
