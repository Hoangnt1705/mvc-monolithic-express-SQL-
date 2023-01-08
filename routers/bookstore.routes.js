const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const bcrypt = require('bcrypt');
const { db } = require('../utils/database.js');
router.post('/api/v1/users-login', upload.none(), handleLoginForm);
// Define the router to handle the registrantion form submission
router.post('/api/v1/user-register', upload.none(), handleFormSubmission);
//
// Start the server 
router.get('/', (req, res) => {
  db.execute('select id, role from users')
    .then(response => {
      let [rows] = response;
      let user = rows.find(element => element.id === Number(req.cookies.login_id))
      if (req.cookies && req.cookies.login_id && user.role === 'user') {
        selectProduct(req, res, 'index.ejs');
      }
      else if (req.cookies && req.cookies.login_id && user.role === 'admin') {
        selectProduct(req, res, 'admin-product.ejs');
      }
      else {
        res.redirect('/login');
      }
    })
    .catch(err => console.error(err));
});
router.get('/products', (req, res) => {
  db.execute('select * from bookstore_schema.product')
    .then(response => {
      let [rows] = response;
      res.render('products.ejs',
        {
          rows
        });
    })
    .catch(err => console.log(err));
});
router.get('/order', (req, res) => {
  res.render('order.ejs');
});
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
router.get('/api/v1/users', (res, req) => {
  db.execute('select * from bookstore_schema.users')
    .then(response => {
      let [rows] = response;
      console.log(rows);
    })
    .catch(err => console.log(err));
});
router.get('/api/v1/books', (res, req) => {
  db.execute('select product.id, product.title, product.imageUrl, product.description, product.price, users.name from bookstore_schema.product, bookstore_schema.users where users.id = product.users_id')
    .then(response => {
      let [rows] = response;
      console.log(rows);
    })
    .catch(err => console.log(err));
});
router.get('/api/v1/users/:id', (res, req) => {
  let { id } = res.params;
  db.execute('select * from bookstore_schema.users where id = ?', [id])
    .then(response => {
      let [rows] = response;
      console.log(rows);
    })
    .catch(err => console.log(err));
});
router.get('/api/v1/books/:id', (res, req) => {
  let { id } = res.params;
  console.log(id);
  db.execute('select * from bookstore_schema.product where id = ?', [id])
    .then(response => {
      let [rows] = response;
      console.log(rows);
    })
    .catch(err => console.log(err));
});
router.post('/api/v1/users', (req, res) => {
  let { username, bod, email, isRole } = req.body;
  db.execute(' select username from bookstore_schema.users')
    .then(response => {
      let [rows] = response;
      let users = rows.find(element => element.username === username)
      if (users) res.status(500).json('User already exists')
      db.execute('INSERT INTO bookstore_schema.users VALUES (?, ?, ?, ?, ? )', [rows.length + 1, username, bod, email, isRole])
        .then(response => {
          res.status(200).json(response);
        })
        .catch(err => console.log(err))
    });
});
router.post('/api/v1/books', (req, res) => {
  let { id, title, imageUrl, description, price, userId, cartId } = req.body;
  db.execute(' select title from bookstore_schema.product')
    .then(response => {
      let [rows] = response;
      let users = rows.find(element => element.title === title)
      if (users) res.status(500).json('User already exists');
      else {
        db.execute('INSERT INTO bookstore_schema.product VALUES (?, ?, ?, ?, ?, ?, ? )', [Date.now(), title, imageUrl, description, price, userId, cartId])
          .then(response => {
            res.status(200).json(response);
          })
          .catch(err => console.log(err))
      };
    });
});
router.put('/api/v1/users/:id', (req, res) => {
  let { id } = req.params;
  let { username, bod, email, isRole } = req.body;
  db.execute('select id from bookstore_schema.users where id = ?', [id])
    .then(response => {
      let [rows] = response;
      console.log(rows);
      let user = rows.find(element => element.id === Number(id))
      if (!user) res.status(500).json('Not found');
      db.execute('UPDATE users SET username = ?, bod = ?, email = ?, is_role = ? WHERE id = ? ', [username, bod, email, isRole, id])
        .then(response => res.status(200).json("Update Success"))
        .catch(err => console.log(err));
    })
    .catch(err => res.status(500).json(err));
})
router.put('/api/v1/books/:id', (req, res) => {
  let { id } = req.params;
  let { title, imageUrl, description, price } = req.body;
  db.execute('select id from bookstore_schema.product where id = ?', [id])
    .then(response => {
      let [rows] = response;
      console.log(rows);
      let user = rows.find(element => element.id === Number(id))
      if (!user) res.status(500).json('Not found');
      db.execute('UPDATE product SET title = ?, imageUrl = ?, description = ?, price = ? WHERE id = ? ', [title, imageUrl, description, price, id])
        .then(response => res.status(200).json("Update Success"))
        .catch(err => console.log(err))
    })
    .catch(err => res.status(500).json(err));
});
router.delete('/api/v1/users/:id', (req, res) => {
  let { id } = req.params;
  console.log(id);
  db.execute('select id from users')
    .then(response => {
      let [rows] = response;
      let user = rows.find(element => element.id === Number(id));
      if (!user) res.status(500).json("users not found")
      db.execute('DELETE FROM users WHERE (`id` = ?)', [id])
        .then(response => res.status(200).json("success delete"))
        .catch(err => res.status(500).json(err));
    })
    .catch(err => console.log(err));
});
router.delete('/api/v1/books/:id', (req, res) => {
  let { id } = req.params;
  console.log(id);
  db.execute('select id from product')
    .then(response => {
      let [rows] = response;
      let user = rows.find(element => element.id === Number(id));
      if (!user) res.status(500).json("users not found")
      db.execute('DELETE FROM product WHERE (`id` = ?)', [id])
        .then(response => res.status(200).json("success delete"))
        .catch(err => res.status(500).json(err));
    })
    .catch(err => console.log(err));
});
router.get('/api/v1/cart-post', (req, res) => {
  db.execute('select product.id, product.title, product.price, product.users_id, cart.id_number from product, cart')
    .then(response => {
      let [rows] = response;
      res.status(200).json({ data: rows });
    })
    .catch(err => res.status(500).json(err));
});
router.post('/api/v1/cart-post', (req, res) => {
  let { idProduct, idCart, title } = req.body;
  console.log(idProduct, idCart, title);
  db.execute('select cart_product.id_items, cart_product.name_product, cart_product.quantity from cart_product, product, cart where product.id = cart_product.products_id and cart.id_number = cart_product.cart_id')
    .then(response => {
      let [rows] = response;
      let user = rows.find(element => element.name_product === title)
      console.log(user);
      if (user) {
        let quantity = user.quantity + 1;
        let idItems = user.id_items;
        db.execute('UPDATE `bookstore_schema`.`cart_product` SET `quantity` = ? WHERE (`cart_product`.`id_items` = ?)', [quantity, idItems])
          .then(response => res.status(200).json(response))
          .catch(err => console.log(err));
      }
      else {
        console.log("aaaa");
        db.execute('INSERT INTO bookstore_schema.cart_product (id_items, products_id, cart_id, name_product, quantity) VALUES (?, ?, ?, ?, ?)', [rows.length + 1, idProduct, idCart, title, 1])
          .then(response => res.status(200).json(response))
          .catch(err => console.log(err));
      }
    })
    .catch(err => console.log(err));
})
router.get('/cart', (req, res) => {
  db.execute('select cart_product.id_items, cart_product.cart_id, cart_product.name_product, cart_product.quantity from bookstore_schema.cart_product, bookstore_schema.cart where cart_product.cart_id = cart.id_number')
    .then(response => {
      let [rows] = response;
      console.log(rows);
      res.render('cart.ejs', {
        rows,
      });
    })
    .catch(err => res.status(500).json(err));
});
router.delete('/api/v1/cart/:id', (req, res) => {
  let { id } = req.params;
  console.log(id);
  db.execute('select id_items from cart_product')
    .then(response => {
      let [rows] = response;
      console.log(rows);
      let user = rows.find(element => element.id_items === Number(id));
      console.log(user);
      if (!user) res.status(500).json("users not found")
      db.execute('DELETE FROM `cart_product` WHERE (`id_items` = ?)', [id])
        .then(response => res.status(200).json({ message: response }))
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});
router.get('/adminproduct', (req, res) => {
  db.execute('select id, role from users')
    .then(response => {
      let [rows] = response;
      let user = rows.find(element => element.id === Number(req.cookies.login_id))
      if (req.cookies && req.cookies.login_id && user.role === 'admin') {
        selectProduct(req, res, 'admin-product.ejs');
      }
      else {
        res.redirect('/login');
      }
    })
    .catch(err => console.error(err));
});
router.get('/api/v1/update-product/:id', (req, res) => {
  let { id } = req.params;
  let { title } = req.body;
  db.execute('select id, role from users')
    .then(response => {
      let [rows] = response;
      let user = rows.find(element => element.id === Number(req.cookies.login_id))
      if (req.cookies && req.cookies.login_id && user.role === 'admin') {
        db.execute('select * from bookstore_schema.product')
          .then(response => {
            let [rows] = response;
            let user = rows.find(element => element.id === Number(id))
            if (!user) res.status(500).json("Not found")
            res.render('add-product.ejs', { user });
          })
      }
      else {
        res.redirect('/login');
      }
    })
    .catch(err => console.error(err));
});
router.put('/api/v1/cart/:id', (req, res) => {
  let { id } = req.params;
  let { title, imageUrl, description, price } = req.body;
  console.log(title, imageUrl, description, price);
  db.execute(' select product.id, product.title, product.imageUrl, product.description, product.price, product.users_id from product, users where product.users_id = users.id')
    .then(response => {
      let [rows] = response;
      let user = rows.find(element => element.id === Number(id))
      if (!user) return res.status(500).json('Not found books');
      db.execute('UPDATE `bookstore_schema`.`product` SET `title` = ?, `imageUrl` = ?, `description` = ?, `price` = ? WHERE (`id` = ?)', [title, imageUrl, description, price, id])
        .then(response => {
          let [rows] = response;
          res.status(200).json(rows);
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

function handleFormSubmission(req, res, next) {
    let { email, username, password, confirmPassword, role } = req.body;
    console.log(email, username, password, confirmPassword, role);
    db.execute('select * from users')
      .then((response) => {
        const [rows] = response;
        console.log(rows);
        let userCount = rows.length + 1
        console.log("a", validateUsername(username, rows));
        if (!validatePassword(password, confirmPassword)) {
          //If the password do not match, render the form with an error message
          res.render('register.ejs', { error: 'Password do not match' })
        }
        else if (validateUsername(username, rows)) {
          console.log({ error: 'Username duplicated' });
        }
        if (!validateUsername(username, rows) && validatePassword(password, confirmPassword)) {
          // If the form data is valid, hash the password
          bcrypt.hash(password, 10)
            .then(hashedPassword => {
              // If the password is hashed successfully, store the email, hashed 
              // password, and role in the database 
              if (role === 'admin') {
                return storeAdmin(userCount, username, email, hashedPassword, role);
              }
              return storeUser(userCount, username, email, hashedPassword, role);
            })
          res.status(200).cookie('user_id', userCount, {
            // Set the cookie to expire in 30days
            expires: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)),
            httpOnly: true, // Make the cookie accessible  only to the server 
            secure: true // Send the cookie over a secure connection
          })
            .json("success")
        };
      })
      .catch(err => {
        next(err);
      })
  }
  
  function handleLoginForm(req, res, next) {
    const { username, password } = req.body;
    findUser(username, function (err, user) {
      if (err) {
        // If there is an error, render the login form with an error message
        res.render('login.ejs', { error: 'An error occurred. Please try again later' })
      }
      else if (!user) {
        // If no user with the matching username is found, render the login form with an error message
        res.render('login.ejs', { error: 'Invalid username or password' });
      }
      else {
        // If a user with the matching username is found, compare the provided password to stored hash password
        bcrypt.compare(password, user[0].password)
          .then(response => {
            // If the password match, set a cookie with the user's id and redirect to the dashboard 
            if (response) {
              res.status(200).cookie('login_id', user[0].id, {
                expires: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)),
                httpOnly: true,
                secure: true
              })
                .json(`You are now logged in !`);
            }
            else {
              // If the password do not match, render the login form with an error message
              res.render('login.ejs', { error: 'Invalid email or password' })
            }
          })
      }
    })
  }
  
  let validatePassword = (password, confirmPassword) => {
    return password === confirmPassword;
  }
  let validateUsername = (username, rows) => {
    let user = rows.find(element => element.username === username);
    return user;
  }
  let storeUser = (userCount, username, email, hashedPassword, role) => {
    return db.execute('INSERT INTO `bookstore_schema`.`users` (id, username, email, password, role) VALUES (?, ?, ?, ?, ?)', [userCount, username, email, hashedPassword, role])
      .then(response => {
        let [user] = response;
        console.log(user);
      })
      .catch(err => console.log(err));
  }
  let storeAdmin = (userCount, username, email, hashedPassword, role) => {
    return db.execute('INSERT INTO `bookstore_schema`.`users` (id, username, email, password, role) VALUES (?, ?, ?, ?, ?)', [userCount, username, email, hashedPassword, role])
      .then(response => {
        let [user] = response;
        console.log(user);
      })
      .catch(err => console.log(err));
  }
  
  let findUser = (username, callback) => {
    db.execute('select * from users where username = ?', [username])
      .then(response => {
        let [rows] = response;
        let user = rows.find(element => element.username === username)
        if (user) {
          return callback(null, response[0]);
        }
        return callback(null, null);
      })
      .catch(err => {
        console.log(err);
        return callback(err, null);
      })
  }
  let selectProduct = (req, res, nameEJS) => {
    db.execute('select * from bookstore_schema.product')
      .then(response => {
        let [rows] = response;
        res.render(nameEJS,
          {
            rows
          });
      })
      .catch(err => console.log(err));
  }
  
module.exports = router;