var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
   name: String,
   position: String,
   accessLevel: Integer,
   startDate: {Type: Date, default: Date.now},
   username: String,
   password: String
});

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", userSchema);
