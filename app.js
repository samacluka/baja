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
const ExpenseReport   = require("./models/expenseReport.js"),
      ExpenseItem     = require("./models/expenseItem.js"),
      User            = require("./models/user"),
      seedDB          = require("./models/seeds.js"),
      Clearance       = require("./models/clearance.js");

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
const expenseReportRoutes = require("./routes/expenseReports"),
      indexRoutes = require("./routes/index"),
      userRoutes  = require("./routes/users");

//require routes
app.use("/expenseReports",expenseReportRoutes);
app.use("/",indexRoutes);
app.use("/users",userRoutes);


// User.create({firstName: "bob", lastName: "smith", username: "dontmatter"}, function(err1, newUser){
//   if(err1 || !newUser){
//     console.log(err1);
//   } else {
//     ExpenseItem.create({itemName: "the best item", category: "material", subteam: "chassis", store: "canadian tire"},function(err2, newItem1){
//       if(err2 || !newItem1){
//         console.log(err2);
//       } else {
//         ExpenseItem.create({itemName: "the best item2", category: "material2", subteam: "ergonomics", store: "bass pro shop"},function(err3, newItem2){
//           if(err3 || !newItem2){
//             console.log(err3);
//           } else {
//             ExpenseReport.create({name: "REPORT NAME"}, function(err4, newReport){
//               if(err4){
//                 console.log(err4);
//               } else {
//                 newReport.expenseItems.push(newItem1);
//                 newReport.expenseItems.push(newItem2);
//                 newReport.author = newUser;
//                 newReport.save(function(err5,data){
//                   if(err5){
//                     console.log(err5);
//                   } else {
//                     console.log(data);
//                   }
//                 });
//               }
//             });
//           }
//         });
//       }
//     });
//   }
// });

/*=================================INIT - END=================================*/
/*=================================LISTEN - BEGIN=============================*/
var serverPort = process.env.PORT || 3000;
app.listen(serverPort, function(){
  console.log("BAJA ENGINE START!");
});
/*=================================LISTEN - END===============================*/
