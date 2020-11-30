const mongoose = require("mongoose");
const user = mongoose.Schema({
  firstName: {
    type: "String",
  },
  lastName: {
    type: "String",
  },
  email: {
    type: "String",
    unique: true,
  },
  age: {
    type: "Number",
  },
  dob: {
    type: "String",
  },
  gender: {
    type: "String",
  },
  address: {
    type: "String",
  },
  role: {
    type: "String",
  },
  password: {
    type: "String",
  },
  agent: {
    type: ["Mixed"],
  },
});
module.exports = mongoose.model("userDetails", user);
