const bcrypt = require('bcrypt');
const { db } = require('../utils/database.js');

module.exports.modelUserRegister = (email, username, password, confirmPassword, role, req, res, next) => {
    return db.execute('select * from users')
        .then((response) => {
            const [rows] = response;
            let userCount = rows.length + 1
            console.log(validateUsername(username, rows));
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
        });
};

module.exports.modelUserLogin = (user, password, req, res, next) => {
    // If a user with the matching username is found, compare the provided password to stored hash password
    return bcrypt.compare(password, user[0].password)
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
            };
        })
        .catch(err => console.log(err));
};

module.exports.modelHome = (req, res) => {
    return db.execute('select id, role from users')
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
                res.redirect('/router/login');
            };
        })
        .catch(err => console.error(err));
};

module.exports.modelProducts = (req, res) => {
    return db.execute('select * from bookstore_schema.product')
        .then(response => {
            let [rows] = response;
            res.render('products.ejs',
                {
                    rows
                });
        })
        .catch(err => console.log(err));
};

module.exports.modelCartPostFetchGet = (req, res) => {
    return db.execute('select product.id, product.title, product.price, product.users_id, cart.id_number from product, cart')
        .then(response => {
            let [rows] = response;
            res.status(200).json({ data: rows });
        })
        .catch(err => res.status(500).json(err));
};

module.exports.modelCartPostFetchPost = (idProduct, idCart, title, req, res) => {
    return db.execute('select cart_product.id_items, cart_product.name_product, cart_product.quantity from cart_product, product, cart where product.id = cart_product.products_id and cart.id_number = cart_product.cart_id')
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
            };
        })
        .catch(err => console.log(err));
};

module.exports.modelCart = (req, res) => {
    return db.execute('select cart_product.id_items, cart_product.cart_id, cart_product.name_product, cart_product.quantity from bookstore_schema.cart_product, bookstore_schema.cart where cart_product.cart_id = cart.id_number')
        .then(response => {
            let [rows] = response;
            console.log(rows);
            res.render('cart.ejs', {
                rows,
            });
        })
        .catch(err => res.status(500).json(err));
};

module.exports.modelCartDelete = (id, req, res) => {
    return db.execute('select id_items from cart_product')
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
};

module.exports.modelAdminProduct = (req, res) => {
    return db.execute('select id, role from users')
        .then(response => {
            let [rows] = response;
            let user = rows.find(element => element.id === Number(req.cookies.login_id))
            if (req.cookies && req.cookies.login_id && user.role === 'admin') {
                selectProduct(req, res, 'admin-product.ejs');
            }
            else {
                res.redirect('/router/login');
            };
        })
        .catch(err => console.error(err));
};

module.exports.modelUpdateProductFetchGet = (id, req, res) => {
    return db.execute('select id, role from users')
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
                res.redirect('/router/login');
            };
        })
        .catch(err => console.error(err));
};

module.exports.modelUpdateProductFetchPut = (id, title, imageUrl, description, price, req, res) => {
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
};

// tạo function clause bởi vì nó có this và nếu muốn dùng nó làm đối số phải truyền function clause này vào
// function handleFormSubmission

// function handleLoginForm

let validatePassword = (password, confirmPassword) => {
    return password === confirmPassword;
};
let validateUsername = (username, rows) => {
    let user = rows.find(element => element.username === username);
    return user;
};
let storeUser = (userCount, username, email, hashedPassword, role) => {
    return db.execute('INSERT INTO `bookstore_schema`.`users` (id, username, email, password, role) VALUES (?, ?, ?, ?, ?)', [userCount, username, email, hashedPassword, role])
        .then(response => {
            let [user] = response;
        })
        .catch(err => console.log(err));
};
let storeAdmin = (userCount, username, email, hashedPassword, role) => {
    return db.execute('INSERT INTO `bookstore_schema`.`users` (id, username, email, password, role) VALUES (?, ?, ?, ?, ?)', [userCount, username, email, hashedPassword, role])
        .then(response => {
            let [user] = response;
            console.log(user);
        })
        .catch(err => console.log(err));
};


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
};