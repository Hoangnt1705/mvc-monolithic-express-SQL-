const express = require('express');
const app = express();
const port = 3700;
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const pool = mysql.createPool({ host: 'localhost', user: 'root', password: 'Baitulong1@', database: 'bookstore_schema' });
const db = pool.promise();
const multer = require('multer');
const upload = multer();
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const router = require('./routers/bookstore.routes.js');
app.use(cookieParser('secret'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'))
app.use(express.static('public'));
app.use('/router', router)
// Handle any errors that are passed to the next middleware
// middleware application
app.get('/register', (req, res) => {
  res.render('register.ejs');
});
app.get('/login', (req, res) => {
  res.render('login.ejs');
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong');
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

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
});

// tạo function clause bởi vì nó có this và nếu muốn dùng nó làm đối số phải truyền function clause này vào
