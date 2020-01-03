var ExpenseReport = require("../models/expenseReport");
var ExpenseItem = require("../models/expenseItem");
var User        = require("../models/user");

var userClearance = require("../interface/clearance.js");

var is = {};

is.approved = function(req,res,next){
  if(process.env.NODE_ENV=="development"){ return next(); } // Skip middleware if in development mode

  if(req.isAuthenticated()){
    if(req.user.approved){
      return next();
    } else {
      req.flash("error","The captains are still reviewing your account");
      res.redirect("back")
    }
  } else {
    req.flash("error","You need to be logged in to do that");
    res.redirect("/auth");
  }
}

is.LoggedIn = function(req,res,next){
  if(process.env.NODE_ENV=="development"){ return next(); } // Skip middleware if in development mode

  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash("error","You need to be logged in to do that");
    res.redirect("/auth");
  }
}

is.ExpenseReportAuthor = function(req,res,next){
  if(process.env.NODE_ENV=="development"){ return next(); } // Skip middleware if in development mode

  if(req.isAuthenticated()){
    ExpenseReport.findById(req.params.id, function(err, foundExpenseReport){
      if(err || !foundExpenseReport){
          console.log(err);
          req.flash('error', 'Sorry, that Expense Report does not exist!');
          res.redirect('/expenseReports');
      } else if(foundExpenseReport.author.equals(req.user._id) || req.user.isAdmin){
          req.expenseReport = foundExpenseReport;
          return next();
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

is.member = function(req,res,next){
  if(process.env.NODE_ENV=="development"){ return next(); } // Skip middleware if in development mode

  if(req.isAuthenticated()){
    User.findById(req.params.id, function(err, foundUser){
      if(err || !foundUser){
          console.log(err);
          req.flash('error', 'Sorry, that member does not exist!');
          res.redirect('/members');
      } else if(foundUser._id.equals(req.user._id) || req.user.isAdmin){
          return next();
      } else {
          req.flash('error', 'You don\'t have permission to do that!');
          res.redirect('/members/' + req.params.id);
      }
    });
  } else {
    req.flash("error","You need to be logged in to do that");
    res.redirect("back");
  }
}

is.CaptainOrMember = function(req,res,next){
  if(process.env.NODE_ENV=="development"){ return next(); } // Skip middleware if in development mode

  if(req.isAuthenticated()){
    User.findById(req.params.id, function(err, foundUser){
      if(err || !foundUser){
          console.log(err);
          req.flash('error', 'Sorry, that member does not exist!');
          res.redirect('/members');
      } else if(foundUser._id.equals(req.user._id) || req.user.isAdmin || req.user.isClearanceGET(userClearance.captain)){
          return next();
      } else {
          req.flash('error', 'You don\'t have permission to do that!');
          res.redirect('/members/' + req.params.id);
      }
    });
  } else {
    req.flash("error","You need to be logged in to do that");
    res.redirect("back");
  }
}

is.Captain = function(req,res,next){
  if(process.env.NODE_ENV=="development"){ return next(); } // Skip middleware if in development mode

  if(req.isAuthenticated()){
    if(req.user.clearanceIsGET(userClearance.captain)){
      return next();
    } else {
      req.flash("error","You do not have the clearance to do that");
      res.redirect("back");
    }
  } else {
    req.flash("error","You need to be logged in to do that");
    res.redirect("/auth");
  }
}

is.CaptainOrExpenseReportAuthor = function(req, res, next){
  if(process.env.NODE_ENV=="development"){ return next(); } // Skip middleware if in development mode

  if(req.isAuthenticated()){
    ExpenseReport.findById(req.params.id, function(err, foundExpenseReport){
      if(err || !foundExpenseReport){
          console.log(err);
          req.flash('error', 'Sorry, that Expense Report does not exist!');
          res.redirect('/expenseReports');
      } else if(foundExpenseReport.author.equals(req.user._id) || req.user.isAdmin || req.user.isClearanceGET(userClearance.captain)){
          req.expenseReport = foundExpenseReport;
          return next();
      } else {
          req.flash("error","You do not have the clearance to do that");
          res.redirect('back');
      }
    });
  } else {
    req.flash("error","You need to be logged in to do that");
    res.redirect("/auth");
  }
}

is.Lead = function(req, res, next){
  if(process.env.NODE_ENV=="development"){ return next(); } // Skip middleware if in development mode

  if(req.isAuthenticated()){
    if(req.user.clearanceIsGET(userClearance.lead)){
        return next();
    } else {
      req.flash("error","You don't have the clearance to do that");
      res.redirect("expenseReports");
    }
  } else {
    req.flash("error","You need to be logged in to do that");
    res.redirect("/auth");
  }
}

module.exports = is;
