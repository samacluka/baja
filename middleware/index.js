var ExpenseReport = require("../models/expenseReport");
var ExpenseItem = require("../models/expenseItem");
var User        = require("../models/user");
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error","You need to be logged in to do that");
  res.redirect("/login");
}

middlewareObj.isApproved = function(req,res,next){
  if(req.isAuthenticated()){
    User.findById(req.user._id, function(err,foundUser){
      if(foundUser.approved == false){
        req.flash("error","Your account has not been approved yet");
        res.redirect("/expenseReports");
      } else {
          return next();
      }
    });
  }
}


middlewareObj.isExpenseItemOwner = function(req, res, next){
  if(req.isAuthenticated()){
    ExpenseItem.findById(req.params.expenseItemId, function(err, foundExpenseItem){
       if(err || !foundExpenseItem){
           console.log(err);
           req.flash('error', 'Sorry, that Expense Item does not exist!');
           res.redirect('/expenseReports');
       } else if(foundExpenseItem.expenseReport.author.id.equals(req.user._id) || req.user.isAdmin){
            req.expenseItem = foundExpenseItem;
            next();
       } else {
           req.flash('error', 'You don\'t have permission to do that!');
           res.redirect('/expenseReports/' + req.params.id);
       }
    });
  } else {
    req.flash('error', 'You must be logged in to do that');
    res.redirect("back");
  }
}

middlewareObj.isExpenseReportOwner = function(req,res,next){
  if(req.isAuthenticated()){
    ExpenseReport.findById(req.params.id, function(err, foundExpenseReport){
      if(err || !foundExpenseReport){
          console.log(err);
          req.flash('error', 'Sorry, that Expense Report does not exist!');
          res.redirect('/expenseReports');
      } else if(foundExpenseReport.author.id.equals(req.user._id) || req.user.isAdmin){
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

module.exports = middlewareObj;
