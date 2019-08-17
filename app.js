/*=================================INIT - BEGIN===============================*/
const express       = require("express"),
      app           = express(),
      bodyParser    = require("body-parser"),
      mongoose      = require("mongoose"),
      passport      = require("passport"),
      localStrategy = require("passport-local"),
      methodOverride= require("method-override"),
      flash         = require("connect-flash"),
      fs            = require("file-system"),
      multer        = require("multer"),
      path          = require("path"),
      dotenv        = require("dotenv").config(); // Configure .env variables


/* Create DB variables */
const ExpenseReport   = require("./models/expenseReport.js"),
      ExpenseItem     = require("./models/expenseItem.js"),
      User            = require("./models/user");

/* Require Custom Middlewares and data */
const userClearance                       = require("./interface/clearance.js"),
      { cloudinaryConfig, uploader }      = require("./API/cloudinary.js");

/* Configure Database */
mongoose.connect(process.env.DATABASEURL, { useNewUrlParser:  true,
                                            useCreateIndex:   true,
                                            useFindAndModify: false });

/* Configure Other packages */
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(flash());
app.use('*', cloudinaryConfig);

//Passport Config
app.use(require("express-session")({
  secret: process.env.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Send to all views
app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.userClearance = userClearance;
  next();
});

/* Create route variables*/
const expenseReportRoutes = require("./routes/expenseReports"),
      indexRoutes         = require("./routes/index"),
      userRoutes          = require("./routes/users");

//require routes
app.use("/expenseReports",expenseReportRoutes);
app.use("/users",userRoutes);
app.use("/",indexRoutes);

/*=================================INIT - END=================================*/
/*=================================LISTEN - BEGIN=============================*/
app.listen(process.env.PORT, function(){
  console.log("BAJA ENGINE START!");
});
/*=================================LISTEN - END===============================*/
