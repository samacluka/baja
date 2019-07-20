var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  clearance: Number,
  image: String,
  isAccepted: Boolean,
  username: String,
  password: String
});

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", userSchema);
