const support = {};

var headers = require("./headers.js").header;

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

support.createHREF = function(allExpenseReports){
  var rows = allExpenseReports.map(function (expenseReport) { // Split all expense Reports into their own arrays and apply the following to each
      var row = [expenseReport._id,
                expenseReport.approved,
                expenseReport.viewed,
                expenseReport.author._id,
                expenseReport.author.firstName,
                expenseReport.author.lastName,
                expenseReport.author.username,
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

      expenseReport.expenseItems.forEach((expenseItem) => {
          tmpItem = [expenseItem._id,
                    expenseItem.itemName,
                    expenseItem.quantity,
                    expenseItem.category,
                    expenseItem.subteam,
                    expenseItem.itemPrice];
          row.push.apply(row, tmpItem);
      });

      return row.join(',');
  });

  rows.unshift(headers.join(',')); // Prepend headers to rows var

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

module.exports = support;
