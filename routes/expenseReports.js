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
  ExpenseReport.findById(req.params.id).populate("expenseItems").populate('author').exec(function(err,foundExpenseReport){
    if(err){
      console.log(err);
    } else {
      res.render("expenseReports/show", {expenseReport: foundExpenseReport});
    }
  });
});


// Post Routes -- Working
router.post("/",middleware.isLoggedIn,function(req,res){
  ExpenseReport.create({name: req.body.expenseReportName,
                      author: req.user,
                      store: req.body.store,
                      currency: req.body.currency,
                      subtotal: req.body.subtotal,
                      tax: req.body.tax,
                      shipping: req.body.shipping,
                      total: req.body.total},
                      function(err1, newExpenseReport){
                        if(err1){
                          console.log(err1);
                        } else {
                          for(var i = 0; i < 30; i++){
                            if(req.body.itemName[i] != ""){
                            ExpenseItem.create({itemName:     req.body.itemName[i],
                                                category:     req.body.category[i],
                                                subteam:      req.body.subteam[i],
                                                itemPrice:    req.body.itemPrice[i],
                                                expenseReport: newExpenseReport},
                                                function(err2, newExpenseItem){
                                                  if(err2){
                                                    console.log(err2);
                                                  } else {
                                                    newExpenseReport.expenseItems.push(newExpenseItem);
                                                    newExpenseReport.save(function(err4,data){
                                                      if(err4){
                                                        console.log(err4);
                                                      } else {
                                                        console.log(data);
                                                      }
                                                    });

                                                    // ExpenseReport.findOne({_id: newExpenseItem.expenseReport}, function(err3, foundExpenseReport){
                                                    //   if(err3){
                                                    //     console.log(err3);
                                                    //   } else {
                                                    //     foundExpenseReport.expenseItems.push(newExpenseItem);
                                                    //     foundExpenseReport.save(function(err4,data){
                                                    //       if(err4){
                                                    //         console.log(err4);
                                                    //       } else {
                                                    //         console.log(data);
                                                    //       }
                                                    //     });
                                                    //   }
                                                    // });
                                                  }
                                                });
                            }
                          }
                        }
                      });
});

// Edit Route
////// rETURN BELOW : middleware.isExpenseReportOwner,
router.get("/:id/edit", function(req,res){
  // ExpenseReport.findById(req.params.id, function(err, foundExpenseReport){
  ExpenseReport.findById(req.params.id).populate("expenseItems").exec(function(err, foundExpenseReport){
      res.render("expenseReports/edit",{expenseReport: foundExpenseReport});
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
