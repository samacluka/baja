const support = {};

var headers = require("./csv_headers.js");

// Checks filetypes of uploaded images
support.checkFileType = function(req, file, cb){
  // Allowed Extensions
  const filetypes = /jpeg|jpg|png|gif/;
  // Check Extensions
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check Mimetype
  const mimetype = filetypes.test(file.mimetype);
  //Check File type
  if(mimetype && extname){
    return cb(null, true);
  } else {
    cb("Error","None image type file");
  }
};

// Check for subteam or cateogry form items and if not available go to prev index
function checkArray(arr,i){
  try{
    if(arr[i] == ''){
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
support.organizeItemData = function(data, newExpenseReport){
  var expenseItems = [];
  for(var i = 0; i < data.itemName.length; i++){
    if(data.itemName[i] != ''){
      try{
        expenseItems.push({itemName:     data.itemName[i],
                          quantity:     data.quantity[i],
                          category:     checkArray(data.category, i), //data.category[i],
                          subteam:      checkArray(data.subteam, i), //data.subteam[i],
                          itemPrice:    data.itemPrice[i],
                          expenseReport: newExpenseReport});
      } catch(err2){
        console.log(err2);
      } // Empty catch acts like "try pass"
    }
  }
  return expenseItems;
}

support.create_href_reports = function(allExpenseReports){ // Creates Row for each report
  var rows = [];
  var tmpRep = [];
  var tmpItem = [];
  allExpenseReports.forEach((expenseReport) => {
    try {
        tmpRep = [expenseReport._id,
                  expenseReport.approved,
                  expenseReport.viewed,
                  expenseReport.author._id,
                  expenseReport.author.firstName,
                  expenseReport.author.lastName,
                  expenseReport.author.clearance,
                  expenseReport.store,
                  expenseReport.currency,
                  expenseReport.subtotal,
                  expenseReport.tax,
                  expenseReport.shipping,
                  expenseReport.total,
                  expenseReport.notes,
                  expenseReport.created,
                  expenseReport.image];
    } catch (e) {
      console.log(e);
    }

    expenseReport.expenseItems.forEach((expenseItem) => {
      try {
        tmpItem = [expenseItem._id,
                  expenseItem.itemName,
                  expenseItem.quantity,
                  expenseItem.category,
                  expenseItem.subteam,
                  expenseItem.itemPrice];
      } catch (e) {
        console.log(e);
      }
        tmpRep.push.apply(tmpRep, tmpItem);
    });
    rows.push(tmpRep.join(','));
  });

  rows.unshift(headers.report.join(',')); // Prepend headers to rows var

  var type = 'data:text/csv;charset=utf-8';
  var data = rows.join('\n');

  if (typeof btoa === 'function') {
      type += ';base64';
      data = btoa(data);
  } else {
      data = encodeURIComponent(data);
  }

  return type + ',' + data;
}

support.create_href_items = function(allExpenseReports){ // Creates report for each item
  var rows = [];
  var tmpRep = [];
  var tmpItem = [];
  var tmpFull = [];
  allExpenseReports.forEach((expenseReport) => {
    try {
      tmpRep = [expenseReport._id,
                expenseReport.approved,
                expenseReport.viewed,
                expenseReport.author._id,
                expenseReport.author.firstName,
                expenseReport.author.lastName,
                expenseReport.author.clearance,
                expenseReport.store,
                expenseReport.currency,
                expenseReport.subtotal,
                expenseReport.tax,
                expenseReport.shipping,
                expenseReport.total,
                expenseReport.notes,
                expenseReport.created,
                expenseReport.image];
    } catch (e) {
      console.log(e);
    }

    expenseReport.expenseItems.forEach((expenseItem) => {
      try {
        tmpItem = [expenseItem._id,
                  expenseItem.itemName,
                  expenseItem.quantity,
                  expenseItem.category,
                  expenseItem.subteam,
                  expenseItem.itemPrice];
      } catch (e) {
        console.log(e);
      }
        tmpFull = tmpRep.concat(tmpItem);
        rows.push(tmpFull.join(','));
    });
  });

  rows.unshift(headers.item.join(',')); // Prepend headers to rows var

  var type = 'data:text/csv;charset=utf-8';
  var data = rows.join('\n');

  if (typeof btoa === 'function') {
      type += ';base64';
      data = btoa(data);
  } else {
      data = encodeURIComponent(data);
  }

  return type + ',' + data;
}

support.folderImages = function(folders, images){
  var retArr = [];
  folders.folders.forEach((folder) => {
    images.resources.forEach((image) => {
      if(image.filename == folder.name){
        retArr.push({
          image_url: image.url,
          name: folder.name,
          path: folder.path
        });
      }
    });
  });
  return retArr;
}

module.exports = support;
