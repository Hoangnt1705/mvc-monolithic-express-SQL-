const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const {userRegister, userLogin, home, products, order, cartPostFetchGet, cartPostFetchPost, cart, cartDelete, adminProduct,
    updateProductFetchGet, updateProductFetchPut } = require('../controllers/bookstore.controller.js')
router.get('/register', (req, res) => {
    res.render('register.ejs');
});
router.get('/login', (req, res) => {
    res.render('login.ejs');
});
// app.get('/check-cookie', (req, res) => {

//   const options = {
//     url: 'http://localhost:3700/login',
//     headers: {
//       Cookie: 'loggedIn=true'
//     }
//   };
//   request(options, (error, response, body) => { 
//     if(error) {
//       // console.log(error);
//       res.send(error);
//     }
//     else {
//       res.send(body);
//       console.log("body", body);
//       console.log(req.cookies.login_id);
//     }
//   })
// });
// Define the router to handle the login form 
router.post('/api/v1/users-login', upload.none(), userLogin);
// Define the router to handle the registrantion form submission
router.post('/api/v1/user-register', upload.none(), userRegister);
//
// Start the server 
router.get('/', home);
router.get('/products', products);
router.get('/order', order);
// router.get('/data/post', (req, res) => {
//   let userId = 1;
//   let cartId = null;
//   fs.readFile('./dev-data/products.json', { encoding: 'utf8' }, (err, data) => {
//     if (err) throw err;
//     data = JSON.parse(data);
//     data.forEach(element => {
//       let dataPut = [
//         Number(element.id),
//         element.title,
//         element.imageUrl,
//         element.description,
//         element.price,
//         userId,
//         cartId
//       ];
//       db.execute('INSERT INTO product VALUES (?, ?, ?, ?, ?, ?, ?)', dataPut)
//         .then(response => {
//           let [records] = response;
//           res.status(200).json({ records: records });
//         })
//         .catch(err => console.error(err));
//     });
//   })
// });
// router.get('/api/v1/users', (res, req) => {
//     db.execute('select * from bookstore_schema.users')
//         .then(response => {
//             let [rows] = response;
//             console.log(rows);
//         })
//         .catch(err => console.log(err));
// });
// router.get('/api/v1/books', (res, req) => {
//     db.execute('select product.id, product.title, product.imageUrl, product.description, product.price, users.name from bookstore_schema.product, bookstore_schema.users where users.id = product.users_id')
//         .then(response => {
//             let [rows] = response;
//             console.log(rows);
//         })
//         .catch(err => console.log(err));
// });
// router.get('/api/v1/users/:id', (res, req) => {
//     let { id } = res.params;
//     db.execute('select * from bookstore_schema.users where id = ?', [id])
//         .then(response => {
//             let [rows] = response;
//             console.log(rows);
//         })
//         .catch(err => console.log(err));
// });
// router.get('/api/v1/books/:id', (res, req) => {
//     let { id } = res.params;
//     console.log(id);
//     db.execute('select * from bookstore_schema.product where id = ?', [id])
//         .then(response => {
//             let [rows] = response;
//             console.log(rows);
//         })
//         .catch(err => console.log(err));
// });
// router.post('/api/v1/users', (req, res) => {
//     let { username, bod, email, isRole } = req.body;
//     db.execute(' select username from bookstore_schema.users')
//         .then(response => {
//             let [rows] = response;
//             let users = rows.find(element => element.username === username)
//             if (users) res.status(500).json('User already exists')
//             db.execute('INSERT INTO bookstore_schema.users VALUES (?, ?, ?, ?, ? )', [rows.length + 1, username, bod, email, isRole])
//                 .then(response => {
//                     res.status(200).json(response);
//                 })
//                 .catch(err => console.log(err))
//         });
// });
// router.post('/api/v1/books', (req, res) => {
//     let { id, title, imageUrl, description, price, userId, cartId } = req.body;
//     db.execute(' select title from bookstore_schema.product')
//         .then(response => {
//             let [rows] = response;
//             let users = rows.find(element => element.title === title)
//             if (users) res.status(500).json('User already exists');
//             else {
//                 db.execute('INSERT INTO bookstore_schema.product VALUES (?, ?, ?, ?, ?, ?, ? )', [Date.now(), title, imageUrl, description, price, userId, cartId])
//                     .then(response => {
//                         res.status(200).json(response);
//                     })
//                     .catch(err => console.log(err))
//             };
//         });
// });
// router.put('/api/v1/users/:id', (req, res) => {
//     let { id } = req.params;
//     let { username, bod, email, isRole } = req.body;
//     db.execute('select id from bookstore_schema.users where id = ?', [id])
//         .then(response => {
//             let [rows] = response;
//             console.log(rows);
//             let user = rows.find(element => element.id === Number(id))
//             if (!user) res.status(500).json('Not found');
//             db.execute('UPDATE users SET username = ?, bod = ?, email = ?, is_role = ? WHERE id = ? ', [username, bod, email, isRole, id])
//                 .then(response => res.status(200).json("Update Success"))
//                 .catch(err => console.log(err));
//         })
//         .catch(err => res.status(500).json(err));
// })
// router.put('/api/v1/books/:id', (req, res) => {
//     let { id } = req.params;
//     let { title, imageUrl, description, price } = req.body;
//     db.execute('select id from bookstore_schema.product where id = ?', [id])
//         .then(response => {
//             let [rows] = response;
//             console.log(rows);
//             let user = rows.find(element => element.id === Number(id))
//             if (!user) res.status(500).json('Not found');
//             db.execute('UPDATE product SET title = ?, imageUrl = ?, description = ?, price = ? WHERE id = ? ', [title, imageUrl, description, price, id])
//                 .then(response => res.status(200).json("Update Success"))
//                 .catch(err => console.log(err))
//         })
//         .catch(err => res.status(500).json(err));
// });
// router.delete('/api/v1/users/:id', (req, res) => {
//     let { id } = req.params;
//     console.log(id);
//     db.execute('select id from users')
//         .then(response => {
//             let [rows] = response;
//             let user = rows.find(element => element.id === Number(id));
//             if (!user) res.status(500).json("users not found")
//             db.execute('DELETE FROM users WHERE (`id` = ?)', [id])
//                 .then(response => res.status(200).json("success delete"))
//                 .catch(err => res.status(500).json(err));
//         })
//         .catch(err => console.log(err));
// });
// router.delete('/api/v1/books/:id', (req, res) => {
//     let { id } = req.params;
//     console.log(id);
//     db.execute('select id from product')
//         .then(response => {
//             let [rows] = response;
//             let user = rows.find(element => element.id === Number(id));
//             if (!user) res.status(500).json("users not found")
//             db.execute('DELETE FROM product WHERE (`id` = ?)', [id])
//                 .then(response => res.status(200).json("success delete"))
//                 .catch(err => res.status(500).json(err));
//         })
//         .catch(err => console.log(err));
// });
router.get('/api/v1/cart-post', cartPostFetchGet);
router.post('/api/v1/cart-post', cartPostFetchPost);
router.get('/cart', cart);
router.delete('/api/v1/cart/:id', cartDelete);
router.get('/adminproduct', adminProduct);
router.get('/api/v1/update-product/:id', updateProductFetchGet);
router.put('/api/v1/cart/:id', updateProductFetchPut);
module.exports = router;