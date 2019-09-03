const express         = require("express"),
      router          = express.Router({mergeParams: true});

const ExpenseReport   = require("../models/expenseReport.js"),
      ExpenseItem     = require("../models/expenseItem.js"),
      User            = require("../models/user.js");

const support         = require("../middleware/support.js"),
      auth            = require("../middleware/auth.js");

const cloudinary      = require('../API/cloudinary.js'),    //{ cloudinaryConfig, uploader }
      multer          = require('../middleware/multer.js'); //{ upload, dataUri }

const mailjet = require("../API/mailjet.js");

const views           = require("../interface/views.js"),
      userClearance   = require("../interface/clearance.js");

// Get Routes
router.get("/",function(req,res){
  ExpenseReport.find().populate('author').populate('expenseItems').exec(function(err,allExpenseReports){
    if(err){
      console.log(err);
    } else {
      var csv_href_rep = support.create_href_reports(allExpenseReports);
      var csv_href_item = support.create_href_items(allExpenseReports);
      res.render(views.members.expenseReports.index, {expenseReports: allExpenseReports,
                                                      csv_href_rep:   csv_href_rep,
                                                      csv_href_item:  csv_href_item})
    }
  });
});

router.get("/new", auth.isLoggedIn, function(req,res){
  if(req.user.clearanceIsGET(userClearance.lead)){
      res.render(views.members.expenseReports.new);
  } else {
    req.flash("error","You don't have the clearance to do that");
    res.redirect("expenseReports");
  }
});

router.get("/:id", function(req,res){      //"/expenseReports/new" must be declared first because it follows the same pattern
  ExpenseReport.findById(req.params.id).populate("expenseItems").populate('author').exec(function(err,foundExpenseReport){
    if(err){
      console.log(err);
    } else {
      res.render(views.members.expenseReports.show, {expenseReport: foundExpenseReport});
    }
  });
});

// Post Routes
router.post("/", auth.isLoggedIn, multer.upload, function(req,res){
  ExpenseReport.create({author: req.user,
                      store: req.body.store,
                      currency: req.body.currency,
                      subtotal: req.body.subtotal,
                      tax: req.body.tax,
                      shipping: req.body.shipping,
                      total: req.body.total,
                      notes: req.body.notes},
                      function(err1, newExpenseReport){
                        if(err1){
                          console.log(err1);
                        } else {
                          var expenseItems = support.organizeItemData(req.body, newExpenseReport);
                          ExpenseItem.insertMany(expenseItems,function(err3,newExpenseItems){
                            if(err3 || !newExpenseItems){
                              console.log(err3);
                            } else {
                              newExpenseReport.expenseItems.push.apply(newExpenseReport.expenseItems, newExpenseItems); // push expense item ids to expense report item array
                              if(req.file != undefined){ // If a photo is submitted - upload to cloudinary
                                cloudinary.uploader.upload(multer.dataUri(req).content,
                                {
                                  folder: "receipts",             // Folder the image is being saved to on cloud
                                  eager : [{quality: "auto:low"}], // Reduce image quality for speed
                                  eager_async: true,              // Do operations async
                                },
                                function(err4, result){ // Upload image to cloudinary
                                  if(err4){
                                    console.log(err4);
                                  } else {
                                    console.log(result);
                                    newExpenseReport.image = result.url;
                                    newExpenseReport.image_id = result.public_id;
                                    newExpenseReport.save().then(function(savedExpenseReport){
                                      req.flash("success","Report successfully created");
                                      res.redirect("expenseReports");
                                    }).catch(function(err){
                                      console.log(err);
                                    });
                                  }
                                });
                              } else {
                                newExpenseReport.save();
                                req.flash("success","Report successfully created - include a picture next time "); // tmp msg
                                res.redirect("expenseReports");
                              }
                            }
                          });
                        }
                      });
});

// Edit Route
////// rETURN BELOW : auth.isExpenseReportOwner,
router.get("/:id/edit", function(req,res){
  ExpenseReport.findById(req.params.id).populate("expenseItems").exec(function(err, foundExpenseReport){
      res.render(views.members.expenseReports.edit, {expenseReport: foundExpenseReport});
  });
});

router.put("/:id",  function(req,res){
  ExpenseReport.findByIdAndUpdate(req.params.id, req.body.expenseReport, function(err,foundExpenseReport){
    if(err){
      console.log(err);
      res.redirect("expenseReports");
    } else {
      res.redirect("expenseReports/"+req.params.id);
    }
  });
});

// Delete Route
router.delete("/:id", auth.isExpenseReportAuthor, function(req,res){
  ExpenseItem.deleteMany({expenseReport: req.params.id},function(err1){ // delete all expense items of the report
    if(err1){
      console.log(err1);
    } else {
      ExpenseReport.findByIdAndRemove(req.params.id, function(err2, foundExpenseReport){ // delete DB document and return contents of deleted document
        if(err2){
          console.log(err2);
        } else {
          if(foundExpenseReport.image){ // If the report has an image remove it from cloudinary
            cloudinary.uploader.destroy(foundExpenseReport.image_id, function(err3){
              if(err3){
                console.log(err3);
              } else {
                req.flash("success","Report successfully deleted");
                res.redirect("expenseReports");
              }
            });
          } else { // if the report doesnt have an image everything is done
            req.flash("success","Report successfully deleted");
            res.redirect("expenseReports");
          }
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
