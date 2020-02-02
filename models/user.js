// Pushpdeep Gangrade
var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    userId: {
      type: String,
      required: [true, "User id is required"]
    },
    userName:{
      type: String,
      required: [true, "Username is required"]
    },
    password:{
      type: Object,
      required: [true, "Password is required"]
    },
    userFirstName: {
      type: String,
      required: [true, "Firstname is required"]
    },
    userLastName: {
      type: String,
      required: [true, "Lastname is required"]
    },
    userEmail: String
  });
module.exports = mongoose.model("User", userSchema);
