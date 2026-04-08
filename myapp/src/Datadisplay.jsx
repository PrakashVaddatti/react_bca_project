import React, { useEffect, useState } from "react";

// const genderMap = {
//   1: "Male",
//   2: "Female",
//   3: "Other",
// };
// const genderOptions = Object.entries(genderMap);

function Datadisplay() {
  const [data, setData] = useState([]);
  const [target, setTarget] = useState("");
  const [userdata, setUserData] = useState({
    fname: "",
    lname: "",
    mobilenumber: "",
    email: "",
    password: "",
    cityid: "",
    gender: "",
  });

  const getDetails = async () => {
    let response = await fetch("http://localhost:5000/userDetails");
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return; // Early exit if there's an issue with the response
    }
    let result = await response.json();
    console.log("Fetched data:", result); // Log the fetched data
    setData(result);
  };

  useEffect(() => {
    getDetails();
  }, []);

  const deleteHandler = async (userid) => {
    let response = await fetch(`http://localhost:5000/deleteUser/${userid}`, {
      method: "DELETE",
    });
    let result = await response.json();
    alert(result.message);
    getDetails();
  };

  const updateHandler = (user) => {
    setTarget(user.userid);
    setUserData({
      fname: user.fname,
      lname: user.lname,
      mobilenumber: user.mobilenumber,
      email: user.email,
      password: user.password,
      cityid: user.cityid,
      gender: user.gender,
    });
  };

  const dataHandler = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveHandler = async (userid) => {
    console.log('User data to be saved:', userdata); // Log the user data
    let response = await fetch(`http://localhost:5000/updateUser/${userid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userdata),
    });
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      alert('Failed to update user. Please try again.');
      return; // Early exit
    }
    let result = await response.json();
    alert(result.message);
    setTarget("");
    getDetails();
  };

  const cancelHandler = () => {
    setTarget("");
  };

  return (
    <table width="100%" style={{ marginTop: "40px" }} border="1">
      <thead className="table-dark" style={{ height: "45px" }}>
        <tr>
          <th>S.No</th> {/* Serial Number Column */}
          <th>First Name</th>
          <th>Last Name</th>
          <th>Mobile Number</th>
          <th>Email</th>
          <th>Password</th>
          <th>City</th>
          <th>Gender</th>
          <th>Delete</th>
          <th>Update</th>
        </tr>
      </thead>
      <tbody style={{ color: "black" }}>
        {data.length > 0 ? (
          data.map((user, index) => (
            <tr key={user.userid}>
              {/* Serial Number */}
              <td style={{ border: "1px solid blue", textAlign: "center" }}>
                {index + 1}
              </td>
              {/* First Name */}
              <td style={{ border: "1px solid blue" }}>
                {target === user.userid ? (
                  <input
                    type="text"
                    name="fname"
                    value={userdata.fname}
                    onChange={dataHandler}
                  />
                ) : (
                  user.fname
                )}
              </td>
              {/* Last Name */}
              <td style={{ border: "1px solid blue" }}>
                {target === user.userid ? (
                  <input
                    type="text"
                    name="lname"
                    value={userdata.lname}
                    onChange={dataHandler}
                  />
                ) : (
                  user.lname
                )}
              </td>
              {/* Mobile Number */}
              <td style={{ border: "1px solid blue" }}>
                {target === user.userid ? (
                  <input
                    type="text"
                    name="mobilenumber"
                    maxLength={10}
                    value={userdata.mobilenumber}
                    onChange={dataHandler}
                  />
                ) : (
                  user.mobilenumber
                )}
              </td>
              {/* Email */}
              <td style={{ border: "1px solid blue" }}>
                {target === user.userid ? (
                  <input
                    type="text"
                    name="email"
                    value={userdata.email}
                    onChange={dataHandler}
                  />
                ) : (
                  user.email
                )}
              </td>
              {/* Password */}
              <td style={{ border: "1px solid blue" }}>
                {target === user.userid ? (
                  <input
                    type="text"
                    name="password"
                    value={userdata.password}
                    onChange={dataHandler}
                  />
                ) : (
                  "*******"
                )}
              </td>
              {/* City */}
              <td style={{ border: "1px solid blue" }}>
                {target === user.userid ? (
                  <input
                    type="text"
                    name="cityid"
                    value={userdata.cityid}
                    onChange={dataHandler}
                  />
                ) : (
                  user.cityname
                )}
              </td>

              {/* Gender */}
              <td style={{ border: "1px solid blue" }}>
                {target === user.userid ? (
                  <select
                    name="gender"
                    value={userdata.gender}
                    onChange={dataHandler}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  user.gender || "Not specified"
                )}
              </td>


              {/* Delete Button */}
              <td style={{ border: "1px solid blue" }}>
                <button
                  className="btn btn-outline-danger"
                  style={{ padding: "3px", width: "80px" }}
                  onClick={() => deleteHandler(user.userid)}
                >
                  Delete
                </button>
              </td>
              {/* Update / Save Buttons */}
              <td style={{ border: "1px solid blue" }}>
                {target === user.userid ? (
                  <>
                    <button
                      style={{ width: "58px" }}
                      className="btn btn-primary"
                      onClick={() => saveHandler(user.userid)}
                    >
                      Save
                    </button>
                    <button
                      style={{ marginLeft: "5px" }}
                      className="btn btn-info"
                      onClick={cancelHandler}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    className="btn btn-outline-info"
                    style={{ padding: "3px", width: "80px" }}
                    onClick={() => updateHandler(user)}
                  >
                    Update
                  </button>
                )}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="9" style={{ textAlign: "center" }}>
              No data available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default Datadisplay;