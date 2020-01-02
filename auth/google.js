var passport       = require("passport"),
    GoogleStrategy = require('passport-google-oauth20').Strategy;

var User           = require("../models/user");

var nodemailer     = require("../emails/nodemailer.js");

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({ googleId: profile.id }, function (err, user) {
      if(err){
        console.log(err);
        done(err, null);
      } else if(user){
        done(null, user);
      } else {
        User.create({
          googleId: profile.id,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
        }, function(err, newUser){

          nodemailer.sendMail({
            from: process.env.GMAIL_USERNAME,
            to: process.env.GMAIL_USERNAME,
            subject: 'New User Requesting Approval',
            text: 'New User: '+ req.user.firstName + ' ' + req.user.lastName
          }, (error, info) => {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
              done(null, newUser);
            }
          });

        });
      }
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

module.exports = passport;
