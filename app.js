var express = require("express");
var app = express();

app.set("view engine", "ejs")

app.get("/",function(req,res){
  res.render("landing");
});

var serverPort = process.env.PORT || 3000;
app.listen(serverPort, function(){
  console.log("BAJA ENGINE START");
});
