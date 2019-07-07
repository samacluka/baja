/*=================================INIT - BEGIN=================================*/
var express           = require("express"),
    app               = express(),
    bodyParser        = require("body-parser"),
    mongoose          = require("mongoose"),
    passport          = require("passport"),
    localStrategy     = require("passport-local"),
    methodOverride    = require("method-override"),
    flash             = require("connect-flash");

/* Cookie Cutter*/
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(flash());

// /* DB connect*/
// const dburl = process.env.DATABASEURL || "mongodb://localhost/baja";
// mongoose.connect(dburl, { useNewUrlParser: true });
//
// /* Create DB variables */
// const ExpenseReport     = require("./models/ExpenseReport.js"),
//       User              = require("./models/user"),
//       seedDB            = require("./models/seeds.js");
//       // ...               = require("./models/.js"),
//
//
// /* Route Variables */
// const indexRoutes = require("./routes/index");
// //       ...Routes = require("./routes/..."),
// //       ...Routes = require("./routes/..."),
//
// /* Route Options */
// app.use("/campgrounds/:id/comments",commentRoutes);
// app.use("/campgrounds",campgroundRoutes);
// app.use("/",indexRoutes);

app.get("/",function(req,res){
  res.render("landing");
});

app.get("/home",function(req,res){
  res.render("home");
});

app.get("/login", function(req,res){
  res.render("login");
});

/*=================================INIT - END=================================*/
/*=================================LISTEN - BEGIN=============================*/
var serverPort = process.env.PORT || 3000;
app.listen(serverPort, function(){
  console.log("BAJA ENGINE START");
});
/*=================================LISTEN - END===============================*/
