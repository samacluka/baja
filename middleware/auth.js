var ExpenseReport = require("../models/expenseReport");
var ExpenseItem = require("../models/expenseItem");
var User        = require("../models/user");

var userClearance = require("../interface/clearance.js");

var middleware = {};


function isApproved(req, res, next){
  if(req.isAuthenticated()){
    User.findById(req.user._id, function(err,foundUser){
      return foundUser.approved;
    });
  }
}

middleware.isLoggedIn = function(req,res,next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash("error","You need to be logged in to do that");
    res.redirect("/login");
  }
}

middleware.isExpenseReportAuthor = function(req,res,next){
  if(req.isAuthenticated()){
    ExpenseReport.findById(req.params.id, function(err, foundExpenseReport){
      if(err || !foundExpenseReport){
          console.log(err);
          req.flash('error', 'Sorry, that Expense Report does not exist!');
          res.redirect('/expenseReports');
      } else if(foundExpenseReport.author.equals(req.user._id) || req.user.isAdmin || req.user.isClearanceGET(userClearance.captain)){
          req.expenseReport = foundExpenseReport;
          next();
      } else {
          req.flash('error', 'You don\'t have permission to do that!');
          res.redirect('/expenseReports/' + req.params.id);
      }
    });
  } else {
    req.flash("error","You need to be logged in to do that");
    res.redirect("back");
  }
}

module.exports = middleware;
