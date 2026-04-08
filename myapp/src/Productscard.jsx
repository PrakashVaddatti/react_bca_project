import React from "react";
import { useNavigate } from 'react-router-dom'
import './Productcard.css'

function Productscard() {
  let navigation = useNavigate()

  let getdata = async () => {
    let response = await fetch("http://localhost:5000/productdisplay", {
      method: "get",
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    })
    let result = await response.json();
    console.log(result)
    if (!response.ok) {
      navigation('/signin')
    }
  }
  getdata();
  return (
    <div>
      <h1>Products</h1>
    </div>
  )
}
export default Productscard;