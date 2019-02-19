const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

// Loading Routes
const offerRoute = require("./routes/api/offer");

const app = express();

// CORS Enabled
app.use(cors());

// bodyparser middleware
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

// connect to MongoDB
mongoose
  .connect("mongodb://localhost/offer", { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/api/offer", offerRoute);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log("Server is Running"));
