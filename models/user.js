var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  clearance: {type: Number, default: 0},
  image: String,
  approved: {type: Boolean, default: false},
  // username: String, // Used for local auth
  // password: String,
  googleId: String,
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
