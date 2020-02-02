// Pushpdeep Gangrade
var mongoose = require("mongoose");

var userConnectionSchema = new mongoose.Schema({
    userId:String,
    conId: {
      type: String,
      required: [true, "required"]
    },
    userRSVP: {
      type: String,
      required: [true, "required"]
    }
  });
module.exports = mongoose.model("UserConnection", userConnectionSchema);
