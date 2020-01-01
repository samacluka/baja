var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  clearance: {type: Number, default: 0},
  image_id: {type: String, default: ""},
  approved: {type: Boolean, default: false},
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
