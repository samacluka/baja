const express = require("express"),
      router  = express.Router({mergeParams: true});

const ExpenseReport   = require("../models/expenseReport.js"),
      ExpenseItem     = require("../models/expenseItem.js"),
      User            = require("../models/user");

var   middleware  = require("../middleware/index");

// Get Routes

// PUT  Routes
router.put("/:id/approve", function(req,res){
  User.findById(req.params.id, function(err, foundUser){
    if(err || !foundUser){
      console.log(err);
    } else {
      foundUser.approved = true;
    }
    res.redirect("back");
  });
});

router.put("/:id/unapprove", function(req,res){
  User.findById(req.params.id, function(err, foundUser){
    if(err || !foundUser){
      console.log(err);
    } else {
      foundUser.approved = false;
    }
    res.redirect("back");
  });
});

module.exports = router;
