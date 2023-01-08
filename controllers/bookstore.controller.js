const bcrypt = require('bcrypt');
const { db } = require('../utils/database.js');
const { modelUserRegister, modelUserLogin, modelHome, modelProducts, modelCartPostFetchGet,
    modelCartPostFetchPost, modelCart, modelCartDelete, modelAdminProduct, modelUpdateProductFetchGet,
    modelUpdateProductFetchPut } = require('../models/bookstore.model.js')
module.exports.userRegister = (req, res, next) => {
    let { email, username, password, confirmPassword, role } = req.body;
    console.log(email, username, password, confirmPassword, role);
    return modelUserRegister(email, username, password, confirmPassword, role, req, res, next);
}
module.exports.userLogin = (req, res, next) => {
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
            return modelUserLogin(user, password, req, res, next);
        };
    });
};

module.exports.home = (req, res) => {
    return modelHome(req, res);
};

module.exports.products = (req, res) => {
    return modelProducts(req, res);
}

module.exports.order = (req, res) => {
    res.render('order.ejs');
};

module.exports.cartPostFetchGet = (req, res) => {
    return modelCartPostFetchGet(req, res);
};

module.exports.cartPostFetchPost = (req, res) => {
    let { idProduct, idCart, title } = req.body;
    return modelCartPostFetchPost(idProduct, idCart, title, req, res);
};

module.exports.cart = (req, res) => {
    return modelCart(req, res);
};

module.exports.cartDelete = (req, res) => {
    let { id } = req.params;
    return modelCartDelete(id, req, res);
};
module.exports.adminProduct = (req, res) => {
    return modelAdminProduct(req, res);
};
module.exports.updateProductFetchGet = (req, res) => {
    let { id } = req.params;
    return modelUpdateProductFetchGet(id, req, res);
};
module.exports.updateProductFetchPut = (req, res) => {
    let { id } = req.params;
    let { title, imageUrl, description, price } = req.body;
    return modelUpdateProductFetchPut(id, title, imageUrl, description, price, req, res);
};
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
};