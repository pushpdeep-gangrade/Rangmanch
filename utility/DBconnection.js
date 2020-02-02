var mongoose = require("mongoose");

var connectDB = async function() {
  try {
    mongoose.connect("mongodb://localhost/Rangmanch_DB", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    var db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", function() {
    console.log("MongoDB Connected");
    });
  } catch (error) {
    console.log("Error while establishing connection to MongoDB : " + error);
  }
};

module.exports = {
  connectDB : connectDB
}
