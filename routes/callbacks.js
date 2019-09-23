const rootDir = "../";

const passport        = require("passport");

const ExpenseReport   = require(rootDir+"models/expenseReport.js"),
      ExpenseItem     = require(rootDir+"models/expenseItem.js"),
      User            = require(rootDir+"models/user.js"),
      Option          = require(rootDir+"models/option.js");

const support         = require(rootDir+"helpers/support.js");

const cloudinary      = require(rootDir+"API/cloudinary.js"),    //{ cloudinaryConfig, uploader, search, api }
      multer          = require(rootDir+"middleware/multer.js"); //{ upload, dataUri }

const mailjet         = require(rootDir+"API/mailjet.js");

const views           = require(rootDir+"interface/views.js"),
      userClearance   = require(rootDir+"interface/clearance.js");

var callbacks = {
  auth: {
    // index
    // logout
    google: {
      // index
      // callback
      // success
    },
  },
  index: {
      get: {
        // index
        // register
        // login
        // logout
        // sponsors
        // recruitment
        // gallery
      },
      post: {
        // register
        // login
      },
      put: {},
      delete: {}
  },
  expenseReports: {
    get: {
      // index
      // new
      // show
      // edit
    },
    post: {
      // new
    },
    put: {
      // save
      // approve
      // unapprove
    },
    delete: {
      // remove
    },
  },
  members: {
    get: {
      // index
      // new
      // show
      // edit
    },
    post: {
      // new
    },
    put: {
      // save
      // approve
      // unapprove
    },
    delete: {
      // remove
    }
  }
};

// ======================================== AUTH ========================================
// INDEX
callbacks.auth.index = function(req,res){
  res.render(views.auth.index);
};

// LOGOUT
callbacks.auth.logout = function(req,res){
  req.logout();
  req.flash("success","Successfully logged out!");
  res.redirect("/");
};

//GOOGLE
callbacks.auth.google.index = passport.authenticate('google', {
  scope: ['profile']
});

callbacks.auth.google.callback = passport.authenticate('google', {
  failureFlash:    true, // Not working on heroku deployed version (works on local copy) -- redirects to auth with no failure flash
  failureRedirect: '/auth'
});

callbacks.auth.google.success = function(req,res){
  if(req.user.approved){
    req.flash("success","Welcome to McMaster Baja Racing " + req.user.firstName);
    res.redirect("/expenseReports");
  } else {
    req.flash("success","Thank you for registering with McMaster Baja Racing! Your account is being reviewed by the captains.");
    res.redirect("/");
  }
};

// ======================================== INDEX ========================================
// GET
callbacks.index.get.index = function(req,res){
  cloudinary.search.expression('folder: home').sort_by('uploaded_at','desc').execute().then((foundImages) => {
    res.render(views.public.home, {images: foundImages});
  });
};

callbacks.index.get.sponsors = function(req,res){
  cloudinary.search.expression('folder: sponsors')
                    .with_field('tags')
                    .sort_by('filename','asc')
                    .max_results(150)
                    .execute().then((foundImages) => {
                        res.render(views.public.sponsors, {images: foundImages});
  });
};

callbacks.index.get.recruitment = function(req,res){
  res.render(views.public.recruitment);
};

callbacks.index.get.gallery = function(req,res){
  cloudinary.api.sub_folders("gallery", function(err, foundFolders){
    if(err){
      console.log(err);
    } else {
      cloudinary.search.expression('folder: gallery').execute().then((foundImages) => {
        res.render(views.public.gallery, {folders: support.folderImages(foundFolders, foundImages)});
      }).catch((err2) => {
        console.log(err2);
      });
    }
  });
};

callbacks.index.get.photos = function(req,res){
  cloudinary.search.expression('folder: gallery/'+req.params.folder).sort_by('uploaded_at','desc').execute().then((foundImages) => {
    res.render(views.public.photos, {images: foundImages});
  }).catch((err) => {
    console.log(err);
  });
};

// POST
// PUT
// DELETE

// ======================================== EXPENSE REPORTS ========================================
// GET
callbacks.expenseReports.get.index = function(req,res){
  if(req.user.clearanceIsGET(userClearance.captain)){
    ExpenseReport.find().sort('-created').populate('author').populate('expenseItems').exec(function(err,allExpenseReports){
      if(err){
        console.log(err);
      } else {
        var csv_href_rep = support.create_href_reports(allExpenseReports);
        var csv_href_item = support.create_href_items(allExpenseReports);
        res.render(views.expenseReports.index, {expenseReports: allExpenseReports,
                                                        csv_href_rep:   csv_href_rep,
                                                        csv_href_item:  csv_href_item})
      }
    });
  } else {
    ExpenseReport.find({author: req.user._id}).sort('-created').populate('author').populate('expenseItems').exec(function(err,allExpenseReports){
      if(err){
        console.log(err);
      } else {
        res.render(views.expenseReports.index, {expenseReports: allExpenseReports,
                                                        csv_href_rep:   "#",
                                                        csv_href_item:  "#"})
      }
    });
  }
};

callbacks.expenseReports.get.new = function(req,res){
  Option.find().exec((err, foundOptions) => {
    res.render(views.expenseReports.new, {options: foundOptions});
  });
};

callbacks.expenseReports.get.show = function(req,res){
  ExpenseReport.findById(req.params.id).populate("expenseItems").populate('author').exec(function(err,foundExpenseReport){
    if(err){
      console.log(err);
    } else {
      foundExpenseReport.viewed = true;
      foundExpenseReport.save((err, foundExpenseReport) => {
        if(err || !foundExpenseReport){
          console.log(err);
        } else {
          res.render(views.expenseReports.show, {expenseReport: foundExpenseReport});
        }
      });
    }
  });
};

callbacks.expenseReports.get.edit = function(req,res){
  ExpenseReport.findById(req.params.id).populate("expenseItems").exec(function(err, foundExpenseReport){
    Option.find().exec((err, foundOptions) => {
      res.render(views.expenseReports.edit, {expenseReport: foundExpenseReport, options: foundOptions});
    });
  });
};

// POST
callbacks.expenseReports.post.new = function(req,res){
  if(req.file == undefined){
    req.flash("error","No image file was uploaded");
    return res.redirect("back");
  }
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
                                cloudinary.uploader.upload(multer.dataUri(req).content,
                                {
                                  folder: "receipts",             // Folder the image is being saved to on cloud
                                  eager : [{quality: "auto:low"}], // Reduce image quality for speed
                                  eager_async: true,              // Do operations async
                                }, function(err4, result){ // Upload image to cloudinary
                                  if(err4){
                                    console.log(err4);
                                  } else {
                                    console.log(result);
                                    newExpenseReport.image = result.url;
                                    newExpenseReport.image_id = result.public_id;
                                    newExpenseReport.save().then(function(savedExpenseReport){
                                      req.flash("success","Report successfully created");
                                      res.redirect("/expenseReports");
                                    }).catch(function(err){
                                      console.log(err);
                                    });
                                  }
                                });
                            }
                          });
                        }
                      });
};

// PUT
callbacks.expenseReports.put.save = function(req,res){
  if(req.file == undefined){ // If no image was uploaded -- just saved form data
    ExpenseReport.findByIdAndUpdate(req.params.id, req.body.expenseReport, function(err,foundExpenseReport){
      if(err){
        console.log(err);
        res.redirect("/expenseReports");
      } else {
        req.flash("success","Report successfully saved");
        res.redirect("/expenseReports/"+req.params.id);
      }
    });
  } else { // If a new image was uploaded save to cloudinary and save form data
    ExpenseReport.findByIdAndUpdate(req.params.id, req.body.expenseReport, function(err,foundExpenseReport){
      if(err){
        console.log(err);
        res.redirect("/expenseReports");
      } else {
        cloudinary.uploader.destroy(foundExpenseReport.image_id, function(err){
          if(err){
            console.log(err);
          } else {
            cloudinary.uploader.upload(multer.dataUri(req).content,
            {
              folder: "receipts",             // Folder the image is being saved to on cloud
              eager : [{quality: "auto:low"}], // Reduce image quality for speed
              eager_async: true,              // Do operations async
            }, function(err, result){ // Upload image to cloudinary
              if(err){
                console.log(err);
              } else {
                console.log(result);
                foundExpenseReport.image = result.url;
                foundExpenseReport.image_id = result.public_id;
                foundExpenseReport.save().then(function(savedExpenseReport){
                  req.flash("success","Report successfully saved");
                  res.redirect("/expenseReports/"+req.params.id);
                }).catch(function(err){
                  console.log(err);
                });
              }
            });
          }
        });
      }
    });
  }
};

callbacks.expenseReports.put.approve = function(req,res){
  ExpenseReport.findById(req.params.id, function(err, foundExpenseReport){
    if(err || !foundExpenseReport){
      console.log(err);
    } else {
      foundExpenseReport.approved = true;
      foundExpenseReport.save(function(err,data){
        if(err){
          console.log(err);
        } else {
          console.log("THE FOLLOWING REPORT WAS APPROVED");
          console.log(data);
        }
      });
    }
    res.redirect("back");
  });
};

callbacks.expenseReports.put.unapprove = function(req,res){
  ExpenseReport.findById(req.params.id, function(err, foundExpenseReport){
    if(err || !foundExpenseReport){
      console.log(err);
    } else {
      foundExpenseReport.approved = false;
      foundExpenseReport.save(function(err,data){
        if(err){
          console.log(err);
        } else {
          console.log("THE FOLLOWING REPORT WAS UNAPPROVED");
          console.log(data);
        }
      });
    }
    res.redirect("back");
  });
};

// DELETE
callbacks.expenseReports.delete.remove = function(req,res){
  ExpenseItem.deleteMany({expenseReport: req.params.id},function(err1){ // delete all expense items of the report
    if(err1){
      console.log(err1);
    } else {
      // Must find report, delete image, then delete report --> because mongoose deprecated the return of object on delete functionality
      ExpenseReport.findById(req.params.id, function(err2, foundExpenseReport){ // find the report
        if(foundExpenseReport.image){ // If the report has an image remove it from cloudinary
          cloudinary.uploader.destroy(foundExpenseReport.image_id, function(err3){
            if(err3){
              console.log(err3);
            } else {
              ExpenseReport.deleteOne({_id: req.params.id}, function(err3){ //Now delete the report
                if(err3){
                  console.log(err3);
                } else {
                  req.flash("success","Report successfully deleted");
                  res.redirect("/expenseReports");
                }
              });
            }
          });
        } else { // if the report doesnt have an image just delete the report
          ExpenseReport.deleteOne({_id: req.params.id}, function(err3){
            if(err3){
              console.log(err3);
            } else {
              req.flash("success","Report successfully deleted");
              res.redirect("/expenseReports");
            }
          });
        }
      });
    }
  });
};

// ======================================== MEMBERS ========================================
// GET
callbacks.members.get.index = function(req,res){
  User.find().exec(function(err, allUsers){
    if(err){
      console.log(err);
    } else {
      res.render(views.members.index, {members: allUsers});
    }
  });
};

callbacks.members.get.new = function(req,res){};

callbacks.members.get.show = function(req,res){
  User.findById(req.params.id, (err, foundUser) => {
    res.render(views.members.show, {member: foundUser});
  });
};

callbacks.members.get.edit = function(req,res){};

// POST
callbacks.members.post.new = function(req,res){};

// PUT
callbacks.members.put.save = function(req,res){};

callbacks.members.put.approve = function(req,res){
  User.findById(req.params.id, function(err, foundUser){
    if(err || !foundUser){
      console.log(err);
    } else {
      foundUser.approved = true;
    }
    res.redirect("back");
  });
};

callbacks.members.put.unapprove = function(req,res){
  User.findById(req.params.id, function(err, foundUser){
    if(err || !foundUser){
      console.log(err);
    } else {
      foundUser.approved = false;
    }
    res.redirect("back");
  });
};

// DELETE
callbacks.members.delete.remove = function(req,res){};

module.exports = callbacks;
