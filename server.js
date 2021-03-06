const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');

// Loading Routes
const offerRoute = require('./routes/api/offer');
const adminRoute = require('./routes/api/admin');

const app = express();

// CORS Enabled
app.use(cors());

// bodyparser middleware
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

// connect to MongoDB
mongoose
  .connect('mongodb://localhost/offer', {
    useNewUrlParser: true
  })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Passport Middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

app.use('/api/offer', offerRoute);
app.use('/api/admin', adminRoute);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log('Server is Running'));
