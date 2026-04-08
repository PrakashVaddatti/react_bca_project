
require("dotenv").config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: { 
    rejectUnauthorized: false 
  }
});

console.log("Email User:", process.env.EMAIL_USER);
console.log("Email Pass:", process.env.EMAIL_PASS ? "YES" : "NO");






const express = require('express');
const app = express();
const db = require('./dbconfig'); // Ensure this is correctly set up to connect to your DB
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
// const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken')
const multer = require('multer');
const moment = require('moment');
const path = require('path');
const { text } = require('body-parser');
const encrypt = require('./cryptoHelper').encrypt




// Middleware setup
app.use(cors());
app.use(express.json());
app.use('/upload', express.static(path.join(__dirname, 'upload')));
let scretekey = "myprojectcode"
let saltRounds = 10;
let otpstorage = {};

// //EmailOtp Send
// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//     }
// })





//data insertation
app.post('/card', async (req, res) => {
    const { fname, lname, mobilenumber, email, password, cityid, gender } = req.body
    const existingUser = "select * from ecomusers where email=?"
    db.query(existingUser, [email], async (error, result) => {
        if (result.length > 0) {
            return res.status(400).json({ message: "User Already Exist" })
        }
        else {

            const otp = Math.floor(100000 + Math.random() * 900000);
            console.log('Receiver Otp is:', otp)
            otpstorage[email] = { otp, expiresAt: Date.now() + 2 * 60 * 1000, userData: { fname, lname, mobilenumber, email, password, cityid, gender } }

            const mailoptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: "your otp code",
                text: `your otp is ${otp}.its valid for 2 minutes.`,
            };
            await transporter.sendMail(mailoptions)
            res.status(200).json({ message: "OTP SENT SUCCESSFULLY" });


            // const sqlQuery="insert into ecomusers(fname,lname,mobilenumber,email,password,cityid,gender) values(?,?,?,?,?,?,?)"
            // bcrypt.hash(password,saltRounds,function(err,hash){
            //     db.query(sqlQuery,[fname,lname,mobilenumber,email,hash,city,gender],(err)=>{
            //         if(err){
            //             console.log(err)
            //             return res.status(401).json({message:"Error"})
            //         }
            //         else res.status(200).json({message:"Data Inserted Successfully"})
            //     })
            // })

        }
    })

})



//Verifyotp
app.post('/verifyotp', (req, res) => {

    let { otp, emailid } = req.body;
    if (!otpstorage[emailid]) {
        return res.status(400).json({ message: "OTP NOT REQUESTED" })
    }
    if (otpstorage[emailid].expiresAt < Date.now()) {
        delete otpstorage[emailid];
        return res.status(400).json({ message: "OTP EXPIRED" });
    }
    if (otpstorage[emailid].otp == otp) {
        const { fname, lname, mobilenumber, email, password, cityid, gender } = otpstorage[emailid].userData;
        const sqlQuery = "insert into ecomusers(fname,lname,mobilenumber,email,password,cityid,gender) values(?,?,?,?,?,?,?)"
        bcrypt.hash(password, saltRounds, function (err, hash) {
            if (err) {
                console.log(err)
                return res.status(500).json({ message: " Hashing Error" })
            }
            db.query(sqlQuery, [fname, lname, mobilenumber, email, hash, cityid, gender], (err) => {
                if (err) {
                    console.log(err)
                    return res.status(500).json({ message: "Database Error" })
                }
                //otp used cleanup
                delete otpstorage[emailid]
                res.status(200).json({ message: "Register Successfully" })
            })
        })
    } else {
        return res.status(400).json({ message: "Invalid OTP" })
    }
})


//GenerateToken
let generatetoken = (userid, userrole) => {
    return jwt.sign({ userid, userrole }, scretekey, { expiresIn: '1h' })
}


//userlogin
app.post('/userlogin', async (req, res) => {
    let { email, password } = req.body
    let sqlQuery = "select *from ecomusers where email=?";
    db.query(sqlQuery, [email], async (err, result) => {
        if (err) return res.status(500).json({ message: "Database Error" })
        if (result.length == 0) return res.status(404).json({ message: "User NOT found" })
        else {
            let user = result[0]
            let checkpwd = await bcrypt.compare(password, user.password)
            if (!checkpwd) {
                return res.status(404).json({ message: "Invalid Password" })
            }
            let token = generatetoken(user.userid, user.role)
            console.log("token", token)
            res.status(200).json({ token, role: user.role, email: user.email });
        }
    })
})


//forgetpassword
app.post('/forgetpwd', (req, res) => {
    let { email } = req.body
    existingUser = "select *from ecomusers where email=?"

    db.query(existingUser, [email], async (error, result) => {
        if (result.length > 0) {
            let user = result[0]
            let encryptkey = encrypt(user.userid.toString());
            let resetLink = `http://localhost:3000/resetLink/?userid=${encodeURIComponent(encryptkey)}`
            const mailoptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Password Reset",
                html: `
              
              <p>Hello ${user.fname}</p>
              <p>Click below to reset your password:</p>
              <a href="${resetLink}">Reset Password</a>
              <p>This link will expire in 15 minutes.</p>
            `
            };

            await transporter.sendMail(mailoptions);
            res.status(200).json({ message: "Reset link sent to email." });
        }
        else {
            return res.status(404).json({ message: "User Not Found" })
        }
    })
})


//Adminlogin
app.post('/adminlogin', async (req, res) => {
    let { email, password } = req.body
    let sqlQuery = "select *from admintable where email=? and password=?";
    db.query(sqlQuery, [email, password], async (err, result) => {
        if (err) return res.status(500).json({ message: "Database Error" })
        if (result.length == 0) return res.status(404).json({ message: "User NOT found or invalid password" })
        else {
            let user = result[0]

            let token = generatetoken(user.adminid, user.role)
            console.log("token", token)
            res.status(200).json({ token, role: user.role });
        }
    })
})


//Token Verify
const verifytoken = async (req, res, next) => {
    let token = req.headers.authorization.split(" ")[1]
    console.log(token)
    if (!token) return res.status(401).json({ error: "Unauthorized" })

    jwt.verify(token, scretekey, (err, decode) => {
        if (err) return res.status(403).json({ error: "Invalid Token" })
        else {
            req.user = decode
            next()
        }
    })
}
//authorizeRoles
const authorizeRoles = roles => async (req, res, next) => {
    console.log(req.user)
    if (!roles.includes(req.user.userrole)) return res.status(403).json({ error: "Access Denied" })
    next()
}

//Productdisplay
app.get('/productdisplay', verifytoken, authorizeRoles(["USER"]), async (req, res) => {
    res.json("Hello")
})

//upload folder create and images setting format&folder
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './upload')
    },
    filename: function (req, file, cb) {
        const stringval = "ecompro_image"
        const extension = path.extname(file.originalname);
        const datetime = new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14);
        const randomNum = Math.floor(Math.random() * 1000000);
        const uniqueFilename = `${stringval}_${datetime}_${randomNum}${extension}`;
        // const uniqueSuffix=moment().format("YYYYMMDD_HHmmss")+"_"+file.originalname;
        cb(null, uniqueFilename)
    }
})
console.log(storage)
const upload = multer({ storage: storage })


//Addproducts
app.post('/addproducts', verifytoken, authorizeRoles(["admin"]), upload.array("images"), async (req, res) => {
    console.log(req.body)
    let { pname, price, model, description, categoryid } = req.body
    const imagename = req.files.map(file => file.filename);
    console.log("imagename", imagename);
    let sqlQuery = "insert into products( productsname, price, model,description, categoryid) values(?,?,?,?,?)"
    db.query(sqlQuery, [pname, price, model, description, categoryid], (err, result) => {
        if (err) return res.status(500).json("Data Base Issue")
        else {
            let pid = result.insertId;
            let data = imagename.map((imgname) => [pid, imgname])
            let imgqry = "insert into productsimages(pid, imagespath) values ?"

            db.query(imgqry, [data], (err) => {
                if (err) return res.status(500).json("Data Base Issue")
                else {
                    res.status(200).json({ message: "Product Added" })
                }
            })
        }
    })
})

//Fetch displayproducts
app.get('/displayProducts', (req, res) => {
    const sqlQuery = `
        SELECT p.*, pi.imagespath 
        FROM products p 
        LEFT JOIN (
            SELECT pid, MIN(imagespath) AS imagespath 
            FROM productsimages 
            GROUP BY pid
        ) pi ON p.productsid = pi.pid
    `;
    db.query(sqlQuery, (err, result) => {
        if (err) return res.status(500).json("Database Issue");
        else return res.status(200).json(result)
    });
});



//allcategorys
app.get('/allcatgoys', (req, res) => {
    const sqlQuery = "select *from category";
    db.query(sqlQuery, (err, result) => {
        if (err) return res.status(500).json("Data base Issue");
        else return res.status(200).json(result)
    })
})


//AddtocartLogin
app.post('/addtocartlogin', verifytoken, authorizeRoles(['USER']), (req, res) => {
    const cart = req.body.cart;
    const userId = req.user.userId;
    const values = cart.map(item => [
        userId,
        item.productsid,
        item.quantity
    ]);
    const query = `insert into cart(user_id,product_id) values ?`;
    db.query(query, [values], (err) => {
        if (err) console.log(err)
        else res.status(200).json({ message: "Add to cart" })
    })
})

//AddtoCart
app.post('/addtocarts', verifytoken, authorizeRoles(["USER"]), (req, res) => {
    const cartItems = req.body;
    const userId = req.user.userid;

    if (!Array.isArray(cartItems)) {
        return res.status(400).json({ message: "Invalid cart format" });
    }

    cartItems.forEach(item => {
        const productId = item.productsid;
        const quantity = item.qunatity;

        const checkQuery = `SELECT * FROM cart WHERE user_id = ? AND product_id = ?`;

        db.query(checkQuery, [userId, productId], (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Database error" });
            }

            if (results.length > 0) {

                const updateQuery = `UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?`;


                db.query(updateQuery, [quantity, userId, productId], (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({ message: "Failed to update cart" });
                    }
                    console.log("Updated existing product in cart");
                });
            } else {

                const insertQuery = ` INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)`;

                db.query(insertQuery, [userId, productId, quantity], (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({ message: "Failed to insert into cart" });
                    }
                    console.log("Inserted new product into cart");
                });
            }
        });
    });

    res.status(200).json({ message: "Cart updated successfully" });
})


//GetCartproduct
app.get('/getcartProduct', verifytoken, authorizeRoles(["USER"]), (req, res) => {
    console.log("HELLOOO")
    let userid = req.user.userid;
    console.log(userid)
    let sqlQuery = `SELECT 
    c.cartid,
    c.quantity,
    p.productsname,
    p.price,
    p.model,
    p.description,
    (
      SELECT pi.imagespath 
      FROM productsimages pi 
      WHERE pi.pid = p.productsid 
      ORDER BY pi.imgesid ASC 
      LIMIT 1
    ) AS imagespath
FROM 
    cart c
JOIN 
    products p ON c.product_id = p.productsid
WHERE 
    c.user_id = ?`
        ;

    db.query(sqlQuery, [userid], (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ message: "Database Error" })
        }
        else {
            console.log("result", result)
            return res.status(200).json(result)
        }
    })
})


// Remove from cart
app.delete('/removeFromCart', verifytoken, (req, res) => {
    const { cartid } = req.body;
    const userid = req.user.userid;

    // First verify the item belongs to the user
    const verifyQuery = `SELECT * FROM cart WHERE cartid = ? AND user_id = ?`;

    db.query(verifyQuery, [cartid, userid], (err, results) => {
        if (err) {
            console.error("Verification error:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Cart item not found or not owned by user" });
        }

        // Proceed with deletion
        const deleteQuery = `DELETE FROM cart WHERE cartid = ?`;

        db.query(deleteQuery, [cartid], (err, result) => {
            if (err) {
                console.error("Deletion error:", err);
                return res.status(500).json({ error: "Failed to delete item" });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Item not found" });
            }

            res.status(200).json({ message: "Item removed from cart" });
        });
    });
});

// Add this to your backend routes
app.put('/updateCartQuantity', verifytoken, (req, res) => {
    const { cartid, quantity } = req.body;
    const userid = req.user.userid;

    // First verify the item belongs to the user
    const verifyQuery = `SELECT * FROM cart WHERE cartid = ? AND user_id = ?`;

    db.query(verifyQuery, [cartid, userid], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (results.length === 0) return res.status(404).json({ error: "Cart item not found" });

        // Update quantity
        const updateQuery = `UPDATE cart SET quantity = ? WHERE cartid = ?`;

        db.query(updateQuery, [quantity, cartid], (err, result) => {
            if (err) return res.status(500).json({ error: "Failed to update quantity" });
            res.status(200).json({ message: "Quantity updated" });
        });
    });
});

//ProductViewMore
app.get('/product/view/:pid', (req, res) => {
    const { pid } = req.params;
    const sql = `
      SELECT p.productsid, p.productsname, p.price, p.model, p.description, p.categoryid, pi.imgesid, pi.imagespath
    FROM products p
    LEFT JOIN productsimages pi ON p.productsid = pi.pid
    WHERE p.productsid = ?
    `;

    db.query(sql, [pid], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });

        if (results.length === 0) return res.status(404).json({ error: 'Product not found' });

        // Group images under product
        const { productsname, price, model, categoryid, description } = results[0];
        const images = results.map(row => ({
            imgesid: row.imageid,
            imagespath: row.imagespath,
        }));

        res.json({
            pid,
            productsname,
            price,
            model,
            description,
            categoryid,
            images,
        });
    });
});

//Fetch CityList
app.get('/citylist', (req, res) => {
    const sqlQuery = "select *from city";
    db.query(sqlQuery, (err, result) => {
        if (err) return res.status(500).json("Data base Issue");
        else return res.status(200).json(result)
    })
})

//Fetch Data
app.get('/userDetails', (req, res) => {
    const sQuery =  `
        SELECT 
            e.userid,
            e.fname,
            e.lname,
            e.mobilenumber,
            e.email,
            e.password,
            e.cityid,
            c.cityname,
            e.gender
        FROM ecomusers e
        LEFT JOIN city c ON e.cityid = c.cityid
    `;

    db.query(sQuery, (err, result) => {
        if (err) console.log(err)
        else res.json(result)
    })
})


//Updatedata
app.put('/updateUser/:id', (req, res) => {
    const userId = req.params.id;
    const { fname, lname, mobilenumber, email, cityid, gender } = req.body;

    // Validate data and run update query here
    console.log("Received update for user:", userId);
    console.log("New data:", req.body);

    // Sample MySQL query
    db.query(
        "UPDATE ecomusers SET fname = ?, lname = ?, mobilenumber = ?, email = ?, cityid=?,gender = ? WHERE userid = ?",
        [fname, lname, mobilenumber, email, cityid, gender, userId],
        (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ message: "Failed to update user" });
            } else {
                res.json({ message: "User updated successfully" });
            }
        }
    );
});


//DeleteData
app.delete('/deleteUser/:id', (req, res) => {
    console.log(req.params.id)
    const uID = req.params.id
    const sQuery = "delete  from ecomusers where userid=?"
    db.query(sQuery, [uID], (err) => {
        if (err) console.log(err)
        else res.json({ message: "Data Deleted " })
    })
})


//Resetpassword
app.put('/resetpassword/:id', (req, res) => {
    const userid = req.params.id
    const { password } = req.body
    bcrypt.hash(password, saltRounds, (err, hash) => {
        let sqlQuery = "Update ecomusers set password=? where userid=?";
        db.query(sqlQuery, [hash, userid], (err) => {
            if (err) res.status(500).json({ error: "Data Denied" })
            else res.status(200).json({ message: "Password Reset Successfully" })
        })
    })
})

//Category Fetch
app.get('/category', (req, res) => {
    const sqlQuery = "select *from category";
    db.query(sqlQuery, (err, result) => {
        if (err) return res.status(500).json("Data base Issue");
        else return res.status(200).json(result)
    })
})

// submit order address
app.post('/submitAddress', verifytoken, (req, res) => {
    const userId = req.user.userid; // from JWT token
    const { name, phone, street, city, state, pincode, is_default } = req.body;

    // Basic validation
    if (!name || !phone || !street || !city || !state || !pincode) {
        return res.status(400).json({ message: "All address fields are required" });
    }

    const insertAddressQuery = `
    INSERT INTO addresses (user_id, name, phone, street, city, state, pincode, is_default)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(
        insertAddressQuery,
        [userId, name, phone, street, city, state, pincode, is_default],
        (err, result) => {
            if (err) {
                console.error("Error inserting address:", err);
                return res.status(500).json({ message: "Database error" });
            }
            res.status(200).json({ message: "Address saved successfully", addressId: result.insertId });
        }
    );
});


// submit order address display
app.get('/getAddresses/:userId', (req, res) => {
    const userId = req.params.userId;

    const fetchAddressesQuery = `
    SELECT * FROM addresses WHERE user_id = ?`;

    db.query(fetchAddressesQuery, [userId], (err, results) => {
        if (err) {
            console.error("Error fetching addresses:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.json(results);
    });
});



// POST endpoint to send order email
app.post('/sendOrderEmail', async (req, res) => {
    const { email, orderDetails, shippingDetails } = req.body;

    // Validate input
    if (!email || typeof email !== 'string' || !orderDetails || !shippingDetails) {
        return res.status(400).json({ message: 'Invalid request data' });
    }


    console.log('Received email:', email);
    console.log('Order Details:', orderDetails);
    console.log('Shipping Details:', shippingDetails);

    // Fetch user info from database
    const getUserQuery = "SELECT * FROM ecomusers WHERE email=?";

    db.query(getUserQuery, [email], async (error, result) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ message: 'Database query failed' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'User Not Found' });
        }

        const user = result[0];

        // Generate product details HTML
        const productsHtml = orderDetails.items.map(item => `
      <tr>
        <td style="padding:8px; border:1px solid #ddd;">
          ${item.productsname}
        </td>
        <td style="padding:8px; border:1px solid #ddd; text-align:center;">₹${item.price}</td>
        <td style="padding:8px; border:1px solid #ddd; text-align:center;">${item.quantity}</td>
        <td style="padding:8px; border:1px solid #ddd; text-align:right;">₹${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

        const totalAmount = orderDetails.totalAmount.toFixed(2);
        const { couponCode, discount } = orderDetails;


        // Compose email HTML
        // Compose email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Order Confirmation - Green Earth',
            html: `
    <h2 style="color:#FFD700 ;">Thank you for your purchase, ${user.fname}!</h2>
    <p>Here are your order details:</p>
    <h3>Shipping Address</h3>
    <p>
      <strong>Name:</strong> ${shippingDetails.name}<br>
      <strong>Phone:</strong> ${shippingDetails.phone}<br>
      <strong>Address:</strong> ${shippingDetails.street}, ${shippingDetails.city}, ${shippingDetails.state} - ${shippingDetails.pincode}
    </p>
    
     
    <h3>Order Items</h3>
    <table style="width:100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="padding:8px; border:1px solid #ddd;">Product</th>
          <th style="padding:8px; border:1px solid #ddd;">Price</th>
          <th style="padding:8px; border:1px solid #ddd;">Quantity</th>
          <th style="padding:8px; border:1px solid #ddd;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${productsHtml}
      </tbody>
    </table>
     ${couponCode && discount > 0 ? `
    <p><strong>Coupon Code:</strong> ${couponCode}</p>
    <p><strong>Discount:</strong> -₹${discount.toFixed(2)}</p>
  ` : ''}
    
    <h3 style="margin-top:20px;">Grand Total: ₹${totalAmount}</h3>
    <p>We will notify you once your order is shipped.</p>
    <p>Thank you for shopping with us!</p>
    <p>Best regards,<br>Green Earth Team</p>
  `
        };

        // Send email
        try {
            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: 'Order confirmation email sent successfully' });
        } catch (err) {
            console.error('Error sending email:', err);
            res.status(500).json({ message: 'Failed to send email' });
        }
    });
});


//extra profile code for knowledge purpose
// app.get('/profile/:email', (req, res) => {
//   const email = req.params.email;
//   const sQuery = "SELECT * FROM ecomusers WHERE email = ?";
//   db.query(sQuery, [email], (err, result) => {
//     if (err) {
//       console.log(err);
//       res.status(500).json({ error: "Database error" });
//     } else if (result.length === 0) {
//       res.status(404).json({ message: "User not found" });
//     } else {
//       res.json(result[0]); // return the user data
//     }
//   });
// });


app.get('/profile', (req, res) => {
    const email = req.query.email;
    if (!email) {
        return res.status(400).json({ error: "Email parameter is required" });
    }
    const sQuery = "SELECT * FROM ecomusers WHERE email = ?";
    db.query(sQuery, [email], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Database error" });
        } else if (result.length === 0) {
            res.status(404).json({ message: "User not found" });
        } else {
            res.json(result[0]);
        }
    });
});


//Updatedata
app.put('/update-profile/:id', (req, res) => {
    const userId = req.params.id; // <-- You need to get userId from URL params
    const { fname, lname, mobilenumber, email, cityid, gender } = req.body;

    // Validate data here if needed
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }
    // Sample MySQL query
    db.query(
        "UPDATE ecomusers SET fname = ?, lname = ?, mobilenumber = ?, email = ?, cityid = ?, gender = ? WHERE userid = ?",
        [fname, lname, mobilenumber, email, cityid, gender, userId],
        (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ message: "Failed to update user" });
            } else {
                res.json({ message: "User updated successfully" });
            }
        }
    );
});



// Delete product by productid
app.delete('/deleteproduct/:productid', verifytoken, authorizeRoles(["admin"]), (req, res) => {
    const { productid } = req.params;

    // First, delete associated images
    const deleteImagesQuery = 'DELETE FROM productsimages WHERE pid = ?';

    db.query(deleteImagesQuery, [productid], (err) => {
        if (err) {
            console.error("Error deleting images:", err);
            return res.status(500).json({ message: "Database issue while deleting images" });
        }

        // Then, delete the product itself
        const deleteProductQuery = 'DELETE FROM products WHERE productsid = ?';

        db.query(deleteProductQuery, [productid], (err) => {
            if (err) {
                console.error("Error deleting product:", err);
                return res.status(500).json({ message: "Database issue while deleting product" });
            }
            res.status(200).json({ message: "Product deleted successfully" });
        });
    });
});



// Start express server
app.listen(5000, (err) => {
    if (err) console.log(err)
    else console.log(5000)
})