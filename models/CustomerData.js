const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CustomerDataSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  offer: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  }
});

module.exports = CustomerData = mongoose.model(
  "customerData",
  CustomerDataSchema
);
