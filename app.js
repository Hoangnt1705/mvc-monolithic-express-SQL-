const express = require('express');
const app = express();
const port = 3700;
const morgan = require('morgan');
const bodyParser = require('body-parser');
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
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong');
});
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
});

