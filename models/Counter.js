const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CounterSchema = new Schema({
  count: {
    type: Number
  }
});

module.exports = Counter = mongoose.model("counter", CounterSchema);
