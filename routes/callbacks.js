const rootDir = "../";

const passport        = require("passport"),
      request         = require('request');

const ExpenseReport   = require(rootDir+"models/expenseReport.js"),
      ExpenseItem     = require(rootDir+"models/expenseItem.js"),
      User            = require(rootDir+"models/user.js"),
      Option          = require(rootDir+"models/option.js");

const support         = require(rootDir+"helpers/support.js");

const cloudinary      = require(rootDir+"API/cloudinary.js"),    //{ cloudinaryConfig, uploader, search, api }
      multer          = require(rootDir+"middleware/multer.js"); //{ upload, dataUri }

const mailjet         = require(rootDir+"API/mailjet.js"),
      nodemailer      = require(rootDir+"emails/nodemailer.js");

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
        // post
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
      // edit
    },
    post: {
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
  failureFlash:    'Authentication failed',
  failureRedirect: '/auth'
});

callbacks.auth.google.success = function(req,res){
  if(req.user.approved){
    req.flash("success","Welcome to McMaster Baja Racing " + req.user.firstName);
    res.redirect("/expenseReports");
  } else {

    if(!req.user.clearanceIsGET(userClearance.captain)){ // Captains dont need to recieve emails for their own submission
      var mailOptions = {
        from: process.env.GMAIL_USERNAME,
        to: process.env.GMAIL_USERNAME,
        subject: 'New User Requesting Approval',
        text: 'New User: '+ req.user.firstName + ' ' + req.user.lastName
      };

      nodemailer.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
          req.flash("success","Thank you for registering with McMaster Baja Racing! Your account is being reviewed by the captains.");
          res.redirect("/home");
        }
      });
    } else {
      req.flash("success","Thank you for registering with McMaster Baja Racing! Your account is being reviewed by the captains.");
      res.redirect("/home");
    }
  }
};

// ======================================== INDEX ========================================
// GET
callbacks.index.get.index = function(req,res){
  // cloudinary.search.expression('folder: home').sort_by('uploaded_at','desc').execute().then((foundImages) => {
  //   res.render(views.public.home, {images: foundImages});
  // });

  request('https://www.googleapis.com/blogger/v3/blogs/1611983928963100169/posts?key='+process.env.GOOGLE_API_KEY, { json: true }, (err, resp, body) => {
    if (err) { return console.log(err); }

    res.render(views.public.home2, {posts: body.items});
  });
};

callbacks.index.get.post = function(req,res){
  request('https://www.googleapis.com/blogger/v3/blogs/1611983928963100169/posts/' + req.params.id + '?key=' + process.env.GOOGLE_API_KEY, { json: true }, (err, resp, body) => {
    if (err) { return console.log(err); }
    res.render(views.public.post, {post: body});
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
  ExpenseReport.find().sort('-created').populate('author').populate('expenseItems').exec(function(err,allExpenseReports){
    if(err){
      console.log(err);
    } else {
      if(req.user.clearanceIsGET(userClearance.captain)){
        var csv_href_rep = support.create_href_reports(allExpenseReports);
        var csv_href_item = support.create_href_items(allExpenseReports);
        res.render(views.expenseReports.index, {expenseReports: allExpenseReports,
                                                        csv_href_rep:   csv_href_rep,
                                                        csv_href_item:  csv_href_item});
      } else {
        res.render(views.expenseReports.index, {expenseReports: allExpenseReports,
                                                        csv_href_rep:   "#",
                                                        csv_href_item:  "#"});
      }
    }
  });
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
                                    if(req.user.clearanceIsGET(userClearance.captain)){ newExpenseReport.approved = true; } // Captain submission automatically approved
                                    newExpenseReport.image = result.url;
                                    newExpenseReport.image_id = result.public_id;
                                    newExpenseReport.save().then(function(savedExpenseReport){

                                      if(!req.user.clearanceIsGET(userClearance.captain)){ // Captains dont need to recieve emails for their own submission
                                        var mailOptions = {
                                          from: process.env.GMAIL_USERNAME,
                                          to: process.env.GMAIL_USERNAME,
                                          subject: 'New Expense Report',
                                          text: 'Created by: '+ req.user.firstName + ' ' + req.user.lastName
                                        };

                                        nodemailer.sendMail(mailOptions, (error, info) => {
                                          if (error) {
                                            console.log(error);
                                          } else {
                                            console.log('Email sent: ' + info.response);
                                            req.flash("success","Report successfully created");
                                            res.redirect("/expenseReports");
                                          }
                                        });
                                      } else {
                                        req.flash("success","Report successfully created");
                                        res.redirect("/expenseReports");
                                      }
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
  ExpenseItem.deleteMany({expenseReport: req.params.id}, function(err){
    if(err){
      console.log(err);
    } else {
      ExpenseReport.findById(req.params.id, function(err,foundExpenseReport){
        if(err){
          console.log(err);
          req.flash("error","Error:"+err);
          res.redirect("/expenseReports");
        } else {
          var og_num_expenseItems = foundExpenseReport.expenseItems.length;

          foundExpenseReport.author = req.user._id;
          foundExpenseReport.store = req.body.expenseReport.store;
          foundExpenseReport.currency = req.body.expenseReport.currency;
          foundExpenseReport.subtotal = req.body.expenseReport.subtotal;
          foundExpenseReport.tax = req.body.expenseReport.tax;
          foundExpenseReport.shipping = req.body.expenseReport.shipping;
          foundExpenseReport.total = req.body.expenseReport.total;
          foundExpenseReport.notes = req.body.expenseReport.notes;

          foundExpenseReport.save().then(function(savedExpenseReport){

            var expenseItems = support.organizeItemData(req.body.expenseReport, savedExpenseReport);

            ExpenseItem.insertMany(expenseItems,function(err3,newExpenseItems){

              if(err3 || !newExpenseItems){
                console.log(err3);
              } else {
                savedExpenseReport.expenseItems.push.apply(savedExpenseReport.expenseItems, newExpenseItems); // push expense item ids to expense report item array

                savedExpenseReport.expenseItems.splice(0,og_num_expenseItems); // Remove OG ids

                savedExpenseReport.save().then((finalExpenseReport) => {
                  if(req.file == undefined){ // If no image was uploaded -- just save form data

                    if(!req.user.clearanceIsGET(userClearance.captain)){ // Captains dont need to recieve emails for their own submission
                      var mailOptions = {
                        from: process.env.GMAIL_USERNAME,
                        to: process.env.GMAIL_USERNAME,
                        subject: 'Updated Expense Report',
                        text: 'Updated by: '+ req.user.firstName + ' ' + req.user.lastName
                      };

                      nodemailer.sendMail(mailOptions, (error, info) => {
                        if (error) {
                          console.log(error);
                        } else {
                          console.log('Email sent: ' + info.response);
                          req.flash("success","Report successfully saved");
                          res.redirect("/expenseReports/"+req.params.id);
                        }
                      });
                    } else {
                      req.flash("success","Report successfully saved");
                      res.redirect("/expenseReports/"+req.params.id);
                    }
                  } else { // If a new image was uploaded save to cloudinary and save form data

                    cloudinary.uploader.destroy(finalExpenseReport.image_id, function(err){
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
                            if(req.user.clearanceIsGET(userClearance.captain)){ newExpenseReport.approved = true; } // Captain submission automatically approved
                            finalExpenseReport.image = result.url;
                            finalExpenseReport.image_id = result.public_id;
                            finalExpenseReport.save().then(() => {

                              if(!req.user.clearanceIsGET(userClearance.captain)){ // Captains dont need to recieve emails for their own submission
                                var mailOptions = {
                                  from: process.env.GMAIL_USERNAME,
                                  to: process.env.GMAIL_USERNAME,
                                  subject: 'Updated Expense Report',
                                  text: 'Updated by: '+ req.user.firstName + ' ' + req.user.lastName
                                };

                                nodemailer.sendMail(mailOptions, (error, info) => {
                                  if (error) {
                                    console.log(error);
                                  } else {
                                    console.log('Email sent: ' + info.response);
                                    req.flash("success","Report successfully saved");
                                    res.redirect("/expenseReports/"+req.params.id);
                                  }
                                });
                              } else {
                                req.flash("success","Report successfully saved");
                                res.redirect("/expenseReports/"+req.params.id);
                              }
                            }).catch((err) => {
                              console.log(err);
                            });
                          }
                        });

                      }
                    });
                  }
                }).catch((err) => {
                  console.log(err);
                });
              }
            });
          }).catch(function(err){
            console.log(err);
          });
        }
      });
    }
  });
}

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

callbacks.members.get.edit = function(req,res){
  User.findById(req.params.id).exec(function(err, foundUser){
    Option.find({select: "clearance"}).exec((err, foundOptions) => {
      res.render(views.members.edit, {member: foundUser, options: foundOptions});
    });
  });
};

// PUT
callbacks.members.put.save = function(req,res){
  User.findById(req.params.id, function(err,foundUser){
    if(err){
      console.log(err);
      req.flash("error","Find User Error: "+err);
      res.redirect("/members");
    } else {
      console.log(req.body);
      foundUser.firstName = req.body.firstName;
      foundUser.lastName = req.body.lastName;

      try{
        foundUser.clearance = req.body.clearance;
      }catch(err){console.log(err);}

      if(req.user.clearanceIsGET(userClearance.captain)){ foundUser.approved = true; } // Captain submission automatically approved

      foundUser.save().then((savedExpenseReport) => {
        if(req.file == undefined){ // If no image was uploaded -- just save form data

          if(!req.user.clearanceIsGET(userClearance.captain)){ // Captains dont need to recieve emails for their own submission
            var mailOptions = {
              from: process.env.GMAIL_USERNAME,
              to: process.env.GMAIL_USERNAME,
              subject: 'Updated Expense Report',
              text: 'Updated by: '+ req.user.firstName + ' ' + req.user.lastName
            };

            nodemailer.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
                req.flash("success","Member successfully saved");
                res.redirect("/members");
              }
            });
          } else {
            req.flash("success","Member successfully saved");
            res.redirect("/members");
          }

        } else { // If a new image was uploaded save to cloudinary and save form data

          cloudinary.uploader.destroy(foundUser.image_id, function(err){
            if(err){
              console.log(err);
            } else {
              cloudinary.uploader.upload(multer.dataUri(req).content,
              {
                folder: "users",             // Folder the image is being saved to on cloud
                eager : [{quality: "auto:low"}], // Reduce image quality for speed
                eager_async: true,              // Do operations async
              }, function(err, result){ // Upload image to cloudinary
                if(err){
                  console.log("Cloudinary Upload Error: "+err);
                } else {
                  foundUser.image_id = result.public_id;
                  foundUser.save().then(() => {

                    if(!req.user.clearanceIsGET(userClearance.captain)){ // Captains dont need to recieve emails for their own submission
                      var mailOptions = {
                        from: process.env.GMAIL_USERNAME,
                        to: process.env.GMAIL_USERNAME,
                        subject: 'Updated Expense Report',
                        text: 'Updated by: '+ req.user.firstName + ' ' + req.user.lastName
                      };

                      nodemailer.sendMail(mailOptions, (error, info) => {
                        if (error) {
                          console.log(error);
                        } else {
                          console.log('Email sent: ' + info.response);
                          req.flash("success","Member successfully saved");
                          res.redirect("/members");
                        }
                      });
                    } else {
                      req.flash("success","Member successfully saved");
                      res.redirect("/members");
                    }
                  }).catch((err) => { console.log(err); });
                }
              });

            }
          });
        }
      }).catch((err) => { console.log(err); });
    };
  });
}

callbacks.members.put.approve = function(req,res){
  User.findById(req.params.id, function(err, foundUser){
    if(err || !foundUser){
      console.log(err);
    } else {
      foundUser.approved = true;
      foundUser.save((err,data) => {
        if(err){ console.log(err); }
        else{
          console.log("THE FOLLOWING USER WAS APPROVED");
          console.log(data);
        }
      });
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
      foundUser.save((err,data) => {
        if(err){ console.log(err); }
        else{
          console.log("THE FOLLOWING USER WAS UNAPPROVED");
          console.log(data);
        }
      });
    }
    res.redirect("back");
  });
};

// DELETE
callbacks.members.delete.remove = function(req,res){
  var expenseItemsArr = [];
  ExpenseReport.find({author: req.params.id}).exec((err, foundExpenseReports) => {

  foundExpenseReports.forEach((expenseReport) => {
    expenseItemsArr.push.apply(expenseItemsArr, expenseReport.expenseItems); // push expense item ids to expense report item array
  });

  ExpenseItem.deleteMany({_id: {$in: expenseItemsArr}},function(err){ // delete all expense items
      if(err){ console.log(err); }
      else{
        ExpenseReport.deleteMany({_id: {$in: foundExpenseReports}},function(err){ // delete all expense REPORTS
          if(err){ console.log(err); }
          else{
            // Must find member, delete image, then delete member --> because mongoose deprecated the return of object on delete functionality
            User.findById(req.params.id, function(err2, foundUser){ // find the user
              if(foundUser.image){ // If the member has an image remove it from cloudinary
                cloudinary.uploader.destroy(foundUser.image, function(err3){
                  if(err3){
                    console.log(err3);
                  } else {
                    User.deleteOne({_id: req.params.id}, function(err3){ //Now delete the report
                      if(err3){
                        console.log(err3);
                      } else {
                        req.flash("success","User successfully deleted");
                        res.redirect("/members");
                      }
                    });
                  }
                });
              } else { // if the report doesnt have an image just delete the report
                User.deleteOne({_id: req.params.id}, function(err3){
                  if(err3){
                    console.log(err3);
                  } else {
                    req.flash("success","User successfully deleted");
                    res.redirect("/members");
                  }
                });
              }
          });
          }
        });
      }
    });
  });
};

module.exports = callbacks;
