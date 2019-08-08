const express = require("express"),
      router  = express.Router({mergeParams: true});

const ExpenseReport   = require("../models/expenseReport.js"),
      ExpenseItem     = require("../models/expenseItem.js"),
      User            = require("../models/user.js");

var   middleware  = require("../middleware/index.js");
var   userClearance = require("../models/clearance.js");

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
  if(req.user.clearanceIsGET(userClearance.captain)){
      res.render("expenseReports/new");
  } else {
    req.flash("error","You don't have the clearance to do that");
    res.redirect("/expenseReports");
  }
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
    return "*** Undeclared By Report Author ***";
  }
}

// Creates array of [item] objects with organized item data
function organizeItemData(data){
  var expenseItems = [];
  for(var i = 0; i < 3; i++){
    if(data.itemName[i] !== ""){
      try{
        expenseItems[i] = {itemName:     data.itemName[i],
                          quantity:     data.quantity[i],
                          category:     checkArray(data.category, i), //data.category[i],
                          subteam:      checkArray(data.subteam, i), //data.subteam[i],
                          itemPrice:    data.itemPrice[i],
                          expenseReport: newExpenseReport};
      } catch(err2){} // Empty catch acts like "try pass"
    }
  }
  return expenseItems;
}

// Post Routes
router.post("/", middleware.isLoggedIn,function(req,res){
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
                          var expenseItems = organizeItemData(req.body);
                          ExpenseItem.insertMany(expenseItems,function(err3,newExpenseItems){
                            if(err3 || !newExpenseItems){
                              console.log(err3);
                            } else {
                              newExpenseReport.expenseItems.push.apply(newExpenseReport.expenseItems, newExpenseItems);
                              newExpenseReport.save();
                              req.flash("success","Report successfully created");
                              res.redirect("expenseReports");
                              }
                          });
                        }
                      });
});

// Edit Route
////// rETURN BELOW : middleware.isExpenseReportOwner,
router.get("/:id/edit", function(req,res){
  ExpenseReport.findById(req.params.id).populate("expenseItems").exec(function(err, foundExpenseReport){
      res.render("expenseReports/edit",{expenseReport: foundExpenseReport});
  });
});

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
router.delete("/:id", middleware.isExpenseReportAuthor, function(req,res){
  ExpenseItem.deleteMany({expenseReport: req.params.id},function(err1){
    if(err1){
      console.log(err1);
    } else {
      ExpenseReport.deleteOne({_id: req.params.id}, function(err2){
        if(err2){
          console.log(err2);
        } else {
          req.flash("success","Report successfully deleted");
          res.redirect("/expenseReports");
        }
      });
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
