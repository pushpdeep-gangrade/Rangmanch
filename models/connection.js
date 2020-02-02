// Pushpdeep Gangrade
var mongoose = require("mongoose");

var connectionSchema = new mongoose.Schema({
    conId: {
        type: String,
        required: [true, "required"]
      },
    conName: {
        type: String,
        required: [true, "required"]
      },
      conTopic: {
          type: String,
          required: [true, "required"]
        },
    conDetails: String,
    conLocation: String,
    conDate: String,
    conTime: String,
    createdBy:String
  });

module.exports = mongoose.model("Connections", connectionSchema);
