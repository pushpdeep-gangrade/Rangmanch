//Pushpdeep Gangrade

var mongoose = require("mongoose");

var userProfileSchema = new mongoose.Schema({
  user: {
    type: Object,
    required: [true, "required"]
  },
  userConnection: {
    type: Array,
    required: [true, "required"]
  }
});

module.exports = mongoose.model("Profile", userProfileSchema);
