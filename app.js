/*=================================INIT - BEGIN===============================*/
const express         = require("express"),
      app             = express(),
      bodyParser      = require("body-parser"),
      mongoose        = require("mongoose"),
      methodOverride  = require("method-override"),
      flash           = require("connect-flash"),
      fs              = require("file-system"),
      multer          = require("multer"),
      path            = require("path"),
      dotenv          = require("dotenv").config(); // Configure .env variables


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
                                            useFindAndModify: false }, () => { console.log("DB Connected")}).catch((err) => console.log(err));

/* Configure Other packages */
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(flash());
app.use('*', cloudinaryConfig);

//Passport Config
// var passport = require("./auth/local.js");
var passport = require("./auth/google.js");
app.use(require("cookie-session")({
  maxAge: 12 * 60 * 60 * 1000, // 12 hrs for cookie expiration
  keys: [process.env.SESSION_SECRET]
}));
app.use(passport.initialize());
app.use(passport.session());

// Send to all views
app.use(function(req,res,next){
  res.locals.currentUser    = req.user;
  res.locals.error          = req.flash("error");
  res.locals.success        = req.flash("success");
  res.locals.userClearance  = userClearance;
  res.locals.header_title   = require("./helpers/views_header.js")(req.url); // Get header title
  next();
});

/* Create route variables*/
const expenseReportRoutes = require("./routes/expenseReports"),
      indexRoutes         = require("./routes/index"),
      memberRoutes        = require("./routes/members"),
      authRoutes          = require("./routes/auth");

//require routes
app.use("/expenseReports",expenseReportRoutes);
app.use("/members",memberRoutes);
app.use("/",indexRoutes);
app.use("/auth", authRoutes);

/*=================================INIT - END=================================*/
/*=================================LISTEN - BEGIN=============================*/
app.listen(process.env.PORT, function(){
  console.log("BAJA ENGINE START!");
});
/*=================================LISTEN - END===============================*/
