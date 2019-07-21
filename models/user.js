var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  position: String,
  clearance: Number,
  image: String,
  approved: {type: Boolean, default: false},
  username: String,
  password: String
});

userSchema.methods.clearanceIsGET = function clearanceIsGET(threshold){
  if(this.clearance >= threshold){
    return true;
  } else {
    return false;
  }
};

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", userSchema);
