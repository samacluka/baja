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

// Check for subteam or cateogry form items and if not available go to prev index
function checkArray(arr,i){
  try{
    if(arr[i] == ""){
      return checkArray(arr, i-1);
    } else {
      return arr[i];
    }
  } catch(err) {
    console.log(err);
    return "*** Undeclared By Report Author ***"
  }
}

// Post Routes -- NOT Working
router.post("/",middleware.isLoggedIn,function(req,res){
  ExpenseReport.create({author: req.user,
                      store: req.body.store,
                      currency: req.body.currency,
                      subtotal: req.body.subtotal,
                      tax: req.body.tax,
                      shipping: req.body.shipping,
                      total: req.body.total,
                      notes: req.body.notes,
                      name: req.body.notes},
                      function(err1, newExpenseReport){
                        if(err1){
                          console.log(err1);
                        } else {
                          var expenseItems = [];
                          for(var i = 0; i < 3; i++){
                            if(req.body.itemName[i] !== ""){
                              try{
                                expenseItems[i] = {itemName:     req.body.itemName[i],
                                                  quantity:     req.body.quantity[i],
                                                  category:     checkArray(req.body.category, i), //req.body.category[i],
                                                  subteam:      checkArray(req.body.subteam, i), //req.body.subteam[i],
                                                  itemPrice:    req.body.itemPrice[i],
                                                  expenseReport: newExpenseReport};
                              } catch(err2){} // Empty catch acts like "try pass"
                            }
                          }
                          ExpenseItem.insertMany(expenseItems,function(err3,newExpenseItems){
                            if(err3 || !newExpenseItems){
                              console.log(err3);
                            } else {
                              newExpenseReport.expenseItems.push.apply(newExpenseReport.expenseItems, newExpenseItems);
                              newExpenseReport.save();
                              res.redirect("expenseReports");
                              }
                          });
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

///// middleware.isExpenseReportOwner,
router.put("/:id",  function(req,res){
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
      foundExpenseReport.save(function(err,data){
        if(err){
          console.log(err);
        } else {
          console.log(data);
        }
      });
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
      foundExpenseReport.save(function(err,data){
        if(err){
          console.log(err);
        } else {
          console.log(data);
        }
      });
    }
    res.redirect("back");
  });
});

module.exports = router;
