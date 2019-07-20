const express = require("express"),
      router  = express.Router({mergeParams: true});

const ExpenseReport  = require("../models/expenseReport.js"),
      ExpenseItem     = require("../models/expenseItem.js"),
      User        = require("../models/user");

var  middleware  = require("../middleware/index"); // index.js is a special name and therefore the path can be stopped at ../middleware not ../middleware/index.js

// Get Routes //
router.get("/new", middleware.isLoggedIn, function(req,res){
  ExpenseReport.findById(req.params.id, function(err, expenseReport){
    if(err){
      console.log(err);
    } else {
      res.render("expenseItems/new", {expenseReport: expenseReport});
    }
  });
});


// Post Routes // Create ExpenseItems
router.post("/", middleware.isLoggedIn, function(req,res){
  ExpenseReport.findById(req.params.id, function(err, expenseReport){
    if(err){
      console.log(err);
      req.flash("error","Something went wrong");
      res.redirect("/expenseReports");
    } else {
      ExpenseItem.create(req.body.expenseItem, function(err, expenseItem){
        if(err){
          req.flash("error","Something went wrong");
          console.log(err);
        } else {
          expenseItem.author.id = req.user._id;
          expenseItem.author.username = req.user.username;
          expenseItem.save();

          expenseReport.expenseItems.push(expenseItem);
          expenseReport.save();

          req.flash("success","Successfully added expenseItem");
          res.redirect("/expenseReports/"+expenseReport._id);
        }
      });
    }
  });
});

// Edit Route
router.get("/:expenseItem_id/edit", middleware.isExpenseItemOwner, function(req,res){
  ExpenseReport.findById(req.params.id, function(err, expenseReport){
    if(err){
      console.log(err);
      res.redirect("/expenseReports");
    } else {
      ExpenseItem.findById(req.params.expenseItem_id, function(err, expenseItem){
        if(err){
          console.log(err);
          res.redirect("back");
        } else {
          res.render("expenseItems/edit",{expenseReport: expenseReport, expenseItem: expenseItem});
        }
      });
    }
  });
});

// Update Route
router.put("/:expenseItem_id", middleware.isExpenseItemOwner, function(req,res){
  ExpenseItem.findByIdAndUpdate(req.params.expenseItem_id, req.body.expenseItem, function(err,unpdatedExpenseItem){
    if(err){
      console.log(err);
      res.redirect("back");
    } else {
      res.redirect("/expenseReports/"+req.params.id);
    }
  });
});

// Delete Route
router.delete("/:expenseItem_id", middleware.isExpenseItemOwner, function(req,res){
  ExpenseItem.findByIdAndRemove(req.params.expenseItem_id, function(err){
    if(err){
      res.redirect("back");
    } else {
      req.flash("success","ExpenseItem Deleted");
      res.redirect("/expenseReports/"+req.params.id);
    }
  });
});

module.exports = router;
