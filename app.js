/*=================================INIT - BEGIN===============================*/
const express       = require("express"),
      app           = express(),
      bodyParser    = require("body-parser"),
      mongoose      = require("mongoose"),
      passport      = require("passport"),
      localStrategy = require("passport-local"),
      methodOverride= require("method-override"),
      flash         = require("connect-flash");

/* Create DB variables */
const ExpenseReport  = require("./models/expenseReport.js"),
      ExpenseItem     = require("./models/expenseItem.js"),
      User        = require("./models/user"),
      seedDB      = require("./models/seeds.js");

const dburl = process.env.DATABASEURL || "mongodb://localhost/baja";
mongoose.connect(dburl, { useNewUrlParser: true, useCreateIndex: true });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(flash());

//Passport Config
app.use(require("express-session")({
  secret: "Once again plum wins cutest dog",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// seedDB(); //Seed Database

// Send CurrentUser to every single route
app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});


/* Create route variables*/
const expenseItemRoutes = require("./routes/expenseItems"),
      expenseReportRoutes = require("./routes/expenseReports"),
      indexRoutes = require("./routes/index");
      
//require routes
app.use("/expenseReports/:id/expenseItems",expenseItemRoutes);
app.use("/expenseReports",expenseReportRoutes);
app.use("/",indexRoutes);

/*=================================INIT - END=================================*/
/*=================================LISTEN - BEGIN=============================*/
var serverPort = process.env.PORT || 3000;
app.listen(serverPort, function(){
  console.log("BAJA ENGINE START!");
});
/*=================================LISTEN - END===============================*/
