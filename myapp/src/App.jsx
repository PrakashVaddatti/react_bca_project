import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css'
import Signup from './signup';
import Datadisplay from './Datadisplay';
import Productscard from './Productscard';
// import Philipsregister from './Philipsregister';
import Domregister from './domregister';
import Philipshome from './Philipshome';
import Homeentry from './Homeentry';
import Dropzone from './Dropzone';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import Userlogin from './Userlogin';
import Adminlogin from './Adminlogin';
import Addproducts from './Addproducts';
import Forgetpwd from './Forgetpwd';
import Resetlink from './Resetlink';
import Logout from './Logout';
import ProductDisplay from './ProductDisplay';
import AddtoCart from './Addtocart';
import ViewProduct from './ViewProduct';
import OrdersPage from './OrderPage';
import DeleteProduct from './Deleteproducts';
import OrderTracking from './OrderTracking';


function App() {
 const [role,setrole]=useState(localStorage.getItem("role"))
 
  const updaterole=(role)=>{
   setrole(role);
   if(role){
      localStorage.setItem("role",role);
   }
   else{
      localStorage.removeItem("role")
   }
  };
 
   return(
    
<Router>
<Philipshome role={role}/>
<Routes>
   <Route path="/" element={<Homeentry/>}/>
   {/* <Route path="/signin" element={<Philipsregister/>}/> */}
   <Route path="/home" element={<Signup/>}/>
   {/* <Route path="/Productscard" element={<Productscard updaterole={updaterole}/>}/> */}
   <Route path="/support" element={<Dropzone/>}/>
   {/* <Route path="/Register" element={<Philipsregister/>}/> */}
   <Route path="/Register" element={<Domregister/>}/>
   <Route path="/Details" element={<Datadisplay/>}/>
   <Route path="/admin-signin" element={<Adminlogin updaterole={updaterole}/>}/>
   <Route path="/addproducts" element={<Addproducts/>}/>
   <Route path="/signin" element={<Userlogin updaterole={updaterole}/>}/>
   <Route path="/forgetpwd" element={<Forgetpwd/>}/>
   <Route path="/resetLink" element={<Resetlink/>}/>
   <Route path="/Logout" element={<Logout updaterole={updaterole}/>}/>
   <Route path="/Productscard" element={<ProductDisplay updaterole={updaterole}/>}/>
   <Route path="/addtocart" element={<AddtoCart updaterole={updaterole}/>}/>
   <Route path="/viewProduct/:id" element={<ViewProduct />}/>
   <Route path="/profile" element={<OrdersPage />}/>
   <Route path="/deleteproduct" element={<DeleteProduct />}/>
   <Route path="/ordertrack" element={<OrderTracking/>}/>
   

  
   
   


</Routes>
   </Router>
   ) 
}
export default App;