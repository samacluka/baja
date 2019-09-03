const express = require("express"),
      router  = express.Router({mergeParams: true}),
      passport = require("passport");

const ExpenseReport  = require("../models/expenseReport.js"),
      ExpenseItem     = require("../models/expenseItem.js"),
      User        = require("../models/user");

const cloudinary      = require('../API/cloudinary.js'),    //{ cloudinaryConfig, uploader }
      multer          = require('../middleware/multer.js'); //{ upload, dataUri }

const views = require("../interface/views.js");

// Get Routes
router.get("/",function(req,res){
  cloudinary.search.expression('folder: home').sort_by('uploaded_at','desc').execute().then((foundImages) => {
    res.render(views.home, {images: foundImages});
  });
});

router.get("/register",function(req,res){
  res.render(views.members.register);
});

router.get("/login",function(req,res){
  res.render(views.members.login);
});

router.get("/logout", function(req,res){
  req.logout();
  req.flash("success","Successfully logged out!");
  res.redirect("/");
});

router.get("/sponsors", function(req,res){
  cloudinary.search.expression('folder: sponsors').with_field('tags').sort_by('uploaded_at','desc').execute().then((foundImages) => {
      res.render(views.external.sponsors, {images: foundImages});
  });
});

router.get("/recruitment", function(req,res){
  res.render(views.external.recruitment);
});

router.get("/gallery", function(req,res){
  cloudinary.search.expression('folder: gallery').sort_by('uploaded_at','desc').execute().then((foundImages) => {
      res.render(views.external.gallery, {images: foundImages});
  });
});

//POST ROUTES
router.post("/register",function(req,res){
  User.register(new User({firstName: req.body.firstName, lastName: req.body.lastName, username: req.body.username}), req.body.password, function(err, user){
    if(err){
      req.flash("error",err.message);
      res.redirect("/register");
      return;
    }
    passport.authenticate("local")(req,res, function(){
      req.flash("success","Welcome to McMaster Baja Racing " + user.firstName);
      res.redirect("/");
    });
  });
});

router.post("/login", passport.authenticate("local",
{
  successRedirect: "/expenseReports",
  successFlash:    "Welcome!",
  failureRedirect: "/login",
  failureFlash:    "Invalid username or password"
}));

module.exports = router;
