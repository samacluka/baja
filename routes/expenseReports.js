const express = require("express"),
      router  = express.Router({mergeParams: true});

const ExpenseReport   = require("../models/expenseReport.js"),
      ExpenseItem     = require("../models/expenseItem.js"),
      User            = require("../models/user");

var   middleware  = require("../middleware/index");

// Get Routes
router.get("/",function(req,res){
  ExpenseReport.find().populate('author').exec(function(err,allExpenseReports){
    if(err){
      console.log(err);
    } else {
      res.render("expenseReports/index",{expenseReports: allExpenseReports})
    }
  });
});

router.get("/new", middleware.isLoggedIn, function(req,res){
  res.render("expenseReports/new");
});

router.get("/:id", function(req,res){      //"/expenseReports/new" must be declared first because it follows the same pattern
  ExpenseReport.findById(req.params.id).populate("expenseItems").exec(function(err,foundExpenseReport){
    if(err){
      console.log(err);
    } else {
      res.render("expenseReports/show", {expenseReport: foundExpenseReport});
    }
  });
});


// Post Routes -- Working
router.post("/",middleware.isLoggedIn,function(req,res){
  ExpenseItem.create({itemName:    req.body.itemName,
                      category:     req.body.category,
                      subteam:      req.body.subteam,
                      store:        req.body.store,
                      currency:     req.body.currency,
                      subtotal:     req.body.subtotal,
                      tax:          req.body.tax,
                      shipping:     req.body.shipping,
                      total:        req.body.total},
                      function(err, newItem){
                        if(err){
                          console.log(err);
                        } else {
                              ExpenseReport.create({author: req.user, expenseItems: newItem}, function(err, newReport){
                                if(err){
                                  console.log(err);
                                } else {
                                  ExpenseItem.findOne({_id: newReport.expenseItems}, function(err, foundItem){
                                    if(err){
                                      console.log(err);
                                    } else {
                                      foundItem.expenseReport.push(newReport);
                                      foundItem.save(function(err, data){
                                        if(err){
                                          console.log(err);
                                        } else {
                                          console.log(data);
                                          res.redirect("/expenseReports");
                                        }
                                      });
                                    }
                                  });
                                }
                              });
                        }});
});

// Edit Route
router.get("/:id/edit", middleware.isExpenseReportOwner, function(req,res){
  ExpenseReport.findById(req.params.id, function(err, foundExpenseReport){
      res.render("expenseReports/edit",{expenseItem: foundExpenseReport.expenseItems});
  });
});

router.put("/:id", middleware.isExpenseReportOwner, function(req,res){
  ExpenseReport.findByIdAndUpdate(req.params.id, req.body.expenseReport, function(err,foundExpenseReport){
    if(err){
      console.log(err);
      res.redirect("/expenseReports");
    } else {
      res.redirect("/expenseReports/"+req.params.id);
    }
  });
});

// Delete Route
router.delete("/:id", middleware.isExpenseReportOwner, function(req,res){
  ExpenseReport.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/expenseReports");
    } else {
      req.flash("success","ExpenseReport Deleted");
      res.redirect("/expenseReports");
    }
  });
});

// Approval  Routes
router.put("/:id/approve", function(req,res){
  ExpenseReport.findById(req.params.id, function(err, foundExpenseReport){
    if(err || !foundExpenseReport){
      console.log(err);
    } else {
      foundExpenseReport.approved = true;
    }
    res.redirect("back");
  });
});

router.put("/:id/unapprove", function(req,res){
  ExpenseReport.findById(req.params.id, function(err, foundExpenseReport){
    if(err || !foundExpenseReport){
      console.log(err);
    } else {
      foundExpenseReport.approved = false;
    }
    res.redirect("back");
  });
});

module.exports = router;
