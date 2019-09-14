const support = {};

var headers = {
item: ['Expense Report ID',
        'Approved by Captain',
        'Viewed by Captain',
        'Author ID',
        'Author First Name',
        'Author Last Name',
        'Author Clearance',
        'Retailer',
        'Currency',
        'Subtotal',
        'Tax',
        'Shipping',
        'Total',
        'Author Notes',
        'Date Created',
        'Receipt URL',
        'Item ID',
        'Item Name',
        'Item Quantity',
        'Item Category',
        'Item Subteam',
        'Item Price'],
report: ['Expense Report ID',
        'Approved by Captain',
        'Viewed by Captain',
        'Author ID',
        'Author First Name',
        'Author Last Name',
        'Author Clearance',
        'Retailer',
        'Currency',
        'Subtotal',
        'Tax',
        'Shipping',
        'Total',
        'Author Notes',
        'Date Created',
        'Receipt URL',
        'Item 1 ID', 'Item 1 Name', 'Item 1 Quantity', 'Item 1 Category', 'Item 1 Subteam', 'Item 1 Price',
        'Item 2 ID', 'Item 2 Name', 'Item 2 Quantity', 'Item 2 Category', 'Item 2 Subteam', 'Item 2 Price',
        'Item 3 ID', 'Item 3 Name', 'Item 3 Quantity', 'Item 3 Category', 'Item 3 Subteam', 'Item 3 Price',
        'Item 4 ID', 'Item 4 Name', 'Item 4 Quantity', 'Item 4 Category', 'Item 4 Subteam', 'Item 4 Price',
        'Item 5 ID', 'Item 5 Name', 'Item 5 Quantity', 'Item 5 Category', 'Item 5 Subteam', 'Item 5 Price',
        'Item 6 ID', 'Item 6 Name', 'Item 6 Quantity', 'Item 6 Category', 'Item 6 Subteam', 'Item 6 Price',
        'Item 7 ID', 'Item 7 Name', 'Item 7 Quantity', 'Item 7 Category', 'Item 7 Subteam', 'Item 7 Price',
        'Item 8 ID', 'Item 8 Name', 'Item 8 Quantity', 'Item 8 Category', 'Item 8 Subteam', 'Item 8 Price',
        'Item 9 ID', 'Item 9 Name', 'Item 9 Quantity', 'Item 9 Category', 'Item 9 Subteam', 'Item 9 Price',
        'Item 10 ID', 'Item 10 Name', 'Item 10 Quantity', 'Item 10 Category', 'Item 10 Subteam', 'Item 10 Price',
        'Item 11 ID', 'Item 11 Name', 'Item 11 Quantity', 'Item 11 Category', 'Item 11 Subteam', 'Item 11 Price',
        'Item 12 ID', 'Item 12 Name', 'Item 12 Quantity', 'Item 12 Category', 'Item 12 Subteam', 'Item 12 Price',
        'Item 13 ID', 'Item 13 Name', 'Item 13 Quantity', 'Item 13 Category', 'Item 13 Subteam', 'Item 13 Price',
        'Item 14 ID', 'Item 14 Name', 'Item 14 Quantity', 'Item 14 Category', 'Item 14 Subteam', 'Item 14 Price',
        'Item 15 ID', 'Item 15 Name', 'Item 15 Quantity', 'Item 15 Category', 'Item 15 Subteam', 'Item 15 Price',
        'Item 16 ID', 'Item 16 Name', 'Item 16 Quantity', 'Item 16 Category', 'Item 16 Subteam', 'Item 16 Price',
        'Item 17 ID', 'Item 17 Name', 'Item 17 Quantity', 'Item 17 Category', 'Item 17 Subteam', 'Item 17 Price',
        'Item 18 ID', 'Item 18 Name', 'Item 18 Quantity', 'Item 18 Category', 'Item 18 Subteam', 'Item 18 Price',
        'Item 19 ID', 'Item 19 Name', 'Item 19 Quantity', 'Item 19 Category', 'Item 19 Subteam', 'Item 19 Price',
        'Item 20 ID', 'Item 20 Name', 'Item 20 Quantity', 'Item 20 Category', 'Item 20 Subteam', 'Item 20 Price',
        'Item 21 ID', 'Item 21 Name', 'Item 21 Quantity', 'Item 21 Category', 'Item 21 Subteam', 'Item 21 Price',
        'Item 22 ID', 'Item 22 Name', 'Item 22 Quantity', 'Item 22 Category', 'Item 22 Subteam', 'Item 22 Price',
        'Item 23 ID', 'Item 23 Name', 'Item 23 Quantity', 'Item 23 Category', 'Item 23 Subteam', 'Item 23 Price',
        'Item 24 ID', 'Item 24 Name', 'Item 24 Quantity', 'Item 24 Category', 'Item 24 Subteam', 'Item 24 Price',
        'Item 25 ID', 'Item 25 Name', 'Item 25 Quantity', 'Item 25 Category', 'Item 25 Subteam', 'Item 25 Price',
        'Item 26 ID', 'Item 26 Name', 'Item 26 Quantity', 'Item 26 Category', 'Item 26 Subteam', 'Item 26 Price',
        'Item 27 ID', 'Item 27 Name', 'Item 27 Quantity', 'Item 27 Category', 'Item 27 Subteam', 'Item 27 Price',
        'Item 28 ID', 'Item 28 Name', 'Item 28 Quantity', 'Item 28 Category', 'Item 28 Subteam', 'Item 28 Price',
        'Item 29 ID', 'Item 29 Name', 'Item 29 Quantity', 'Item 29 Category', 'Item 29 Subteam', 'Item 29 Price',
        'Item 30 ID', 'Item 30 Name', 'Item 30 Quantity', 'Item 30 Category', 'Item 30 Subteam', 'Item 30 Price',
        'Item 31 ID', 'Item 31 Name', 'Item 31 Quantity', 'Item 31 Category', 'Item 31 Subteam', 'Item 31 Price',
        'Item 32 ID', 'Item 32 Name', 'Item 32 Quantity', 'Item 32 Category', 'Item 32 Subteam', 'Item 32 Price',
        'Item 33 ID', 'Item 33 Name', 'Item 33 Quantity', 'Item 33 Category', 'Item 33 Subteam', 'Item 33 Price',
        'Item 34 ID', 'Item 34 Name', 'Item 34 Quantity', 'Item 34 Category', 'Item 34 Subteam', 'Item 34 Price',
        'Item 35 ID', 'Item 35 Name', 'Item 35 Quantity', 'Item 35 Category', 'Item 35 Subteam', 'Item 35 Price',
        'Item 36 ID', 'Item 36 Name', 'Item 36 Quantity', 'Item 36 Category', 'Item 36 Subteam', 'Item 36 Price',
        'Item 37 ID', 'Item 37 Name', 'Item 37 Quantity', 'Item 37 Category', 'Item 37 Subteam', 'Item 37 Price',
        'Item 38 ID', 'Item 38 Name', 'Item 38 Quantity', 'Item 38 Category', 'Item 38 Subteam', 'Item 38 Price',
        'Item 39 ID', 'Item 39 Name', 'Item 39 Quantity', 'Item 39 Category', 'Item 39 Subteam', 'Item 39 Price',
        'Item 40 ID', 'Item 40 Name', 'Item 40 Quantity', 'Item 40 Category', 'Item 40 Subteam', 'Item 40 Price',
        'Item 41 ID', 'Item 41 Name', 'Item 41 Quantity', 'Item 41 Category', 'Item 41 Subteam', 'Item 41 Price',
        'Item 42 ID', 'Item 42 Name', 'Item 42 Quantity', 'Item 42 Category', 'Item 42 Subteam', 'Item 42 Price',
        'Item 43 ID', 'Item 43 Name', 'Item 43 Quantity', 'Item 43 Category', 'Item 43 Subteam', 'Item 43 Price',
        'Item 44 ID', 'Item 44 Name', 'Item 44 Quantity', 'Item 44 Category', 'Item 44 Subteam', 'Item 44 Price',
        'Item 45 ID', 'Item 45 Name', 'Item 45 Quantity', 'Item 45 Category', 'Item 45 Subteam', 'Item 45 Price',
        'Item 46 ID', 'Item 46 Name', 'Item 46 Quantity', 'Item 46 Category', 'Item 46 Subteam', 'Item 46 Price',
        'Item 47 ID', 'Item 47 Name', 'Item 47 Quantity', 'Item 47 Category', 'Item 47 Subteam', 'Item 47 Price',
        'Item 48 ID', 'Item 48 Name', 'Item 48 Quantity', 'Item 48 Category', 'Item 48 Subteam', 'Item 48 Price',
        'Item 49 ID', 'Item 49 Name', 'Item 49 Quantity', 'Item 49 Category', 'Item 49 Subteam', 'Item 49 Price',
        'Item 50 ID', 'Item 50 Name', 'Item 50 Quantity', 'Item 50 Category', 'Item 50 Subteam', 'Item 50 Price',
        'Item 51 ID', 'Item 51 Name', 'Item 51 Quantity', 'Item 51 Category', 'Item 51 Subteam', 'Item 51 Price',
        'Item 52 ID', 'Item 52 Name', 'Item 52 Quantity', 'Item 52 Category', 'Item 52 Subteam', 'Item 52 Price',
        'Item 53 ID', 'Item 53 Name', 'Item 53 Quantity', 'Item 53 Category', 'Item 53 Subteam', 'Item 53 Price',
        'Item 54 ID', 'Item 54 Name', 'Item 54 Quantity', 'Item 54 Category', 'Item 54 Subteam', 'Item 54 Price',
        'Item 55 ID', 'Item 55 Name', 'Item 55 Quantity', 'Item 55 Category', 'Item 55 Subteam', 'Item 55 Price',
        'Item 56 ID', 'Item 56 Name', 'Item 56 Quantity', 'Item 56 Category', 'Item 56 Subteam', 'Item 56 Price',
        'Item 57 ID', 'Item 57 Name', 'Item 57 Quantity', 'Item 57 Category', 'Item 57 Subteam', 'Item 57 Price',
        'Item 58 ID', 'Item 58 Name', 'Item 58 Quantity', 'Item 58 Category', 'Item 58 Subteam', 'Item 58 Price',
        'Item 59 ID', 'Item 59 Name', 'Item 59 Quantity', 'Item 59 Category', 'Item 59 Subteam', 'Item 59 Price',
        'Item 60 ID', 'Item 60 Name', 'Item 60 Quantity', 'Item 60 Category', 'Item 60 Subteam', 'Item 60 Price',
        'Item 61 ID', 'Item 61 Name', 'Item 61 Quantity', 'Item 61 Category', 'Item 61 Subteam', 'Item 61 Price',
        'Item 62 ID', 'Item 62 Name', 'Item 62 Quantity', 'Item 62 Category', 'Item 62 Subteam', 'Item 62 Price',
        'Item 63 ID', 'Item 63 Name', 'Item 63 Quantity', 'Item 63 Category', 'Item 63 Subteam', 'Item 63 Price',
        'Item 64 ID', 'Item 64 Name', 'Item 64 Quantity', 'Item 64 Category', 'Item 64 Subteam', 'Item 64 Price',
        'Item 65 ID', 'Item 65 Name', 'Item 65 Quantity', 'Item 65 Category', 'Item 65 Subteam', 'Item 65 Price',
        'Item 66 ID', 'Item 66 Name', 'Item 66 Quantity', 'Item 66 Category', 'Item 66 Subteam', 'Item 66 Price',
        'Item 67 ID', 'Item 67 Name', 'Item 67 Quantity', 'Item 67 Category', 'Item 67 Subteam', 'Item 67 Price',
        'Item 68 ID', 'Item 68 Name', 'Item 68 Quantity', 'Item 68 Category', 'Item 68 Subteam', 'Item 68 Price',
        'Item 69 ID', 'Item 69 Name', 'Item 69 Quantity', 'Item 69 Category', 'Item 69 Subteam', 'Item 69 Price',
        'Item 70 ID', 'Item 70 Name', 'Item 70 Quantity', 'Item 70 Category', 'Item 70 Subteam', 'Item 70 Price',
        'Item 71 ID', 'Item 71 Name', 'Item 71 Quantity', 'Item 71 Category', 'Item 71 Subteam', 'Item 71 Price',
        'Item 72 ID', 'Item 72 Name', 'Item 72 Quantity', 'Item 72 Category', 'Item 72 Subteam', 'Item 72 Price',
        'Item 73 ID', 'Item 73 Name', 'Item 73 Quantity', 'Item 73 Category', 'Item 73 Subteam', 'Item 73 Price',
        'Item 74 ID', 'Item 74 Name', 'Item 74 Quantity', 'Item 74 Category', 'Item 74 Subteam', 'Item 74 Price',
        'Item 75 ID', 'Item 75 Name', 'Item 75 Quantity', 'Item 75 Category', 'Item 75 Subteam', 'Item 75 Price',
        'Item 76 ID', 'Item 76 Name', 'Item 76 Quantity', 'Item 76 Category', 'Item 76 Subteam', 'Item 76 Price',
        'Item 77 ID', 'Item 77 Name', 'Item 77 Quantity', 'Item 77 Category', 'Item 77 Subteam', 'Item 77 Price',
        'Item 78 ID', 'Item 78 Name', 'Item 78 Quantity', 'Item 78 Category', 'Item 78 Subteam', 'Item 78 Price',
        'Item 79 ID', 'Item 79 Name', 'Item 79 Quantity', 'Item 79 Category', 'Item 79 Subteam', 'Item 79 Price',
        'Item 80 ID', 'Item 80 Name', 'Item 80 Quantity', 'Item 80 Category', 'Item 80 Subteam', 'Item 80 Price',
        'Item 81 ID', 'Item 81 Name', 'Item 81 Quantity', 'Item 81 Category', 'Item 81 Subteam', 'Item 81 Price',
        'Item 82 ID', 'Item 82 Name', 'Item 82 Quantity', 'Item 82 Category', 'Item 82 Subteam', 'Item 82 Price',
        'Item 83 ID', 'Item 83 Name', 'Item 83 Quantity', 'Item 83 Category', 'Item 83 Subteam', 'Item 83 Price',
        'Item 84 ID', 'Item 84 Name', 'Item 84 Quantity', 'Item 84 Category', 'Item 84 Subteam', 'Item 84 Price',
        'Item 85 ID', 'Item 85 Name', 'Item 85 Quantity', 'Item 85 Category', 'Item 85 Subteam', 'Item 85 Price',
        'Item 86 ID', 'Item 86 Name', 'Item 86 Quantity', 'Item 86 Category', 'Item 86 Subteam', 'Item 86 Price',
        'Item 87 ID', 'Item 87 Name', 'Item 87 Quantity', 'Item 87 Category', 'Item 87 Subteam', 'Item 87 Price',
        'Item 88 ID', 'Item 88 Name', 'Item 88 Quantity', 'Item 88 Category', 'Item 88 Subteam', 'Item 88 Price',
        'Item 89 ID', 'Item 89 Name', 'Item 89 Quantity', 'Item 89 Category', 'Item 89 Subteam', 'Item 89 Price',
        'Item 90 ID', 'Item 90 Name', 'Item 90 Quantity', 'Item 90 Category', 'Item 90 Subteam', 'Item 90 Price',
        'Item 91 ID', 'Item 91 Name', 'Item 91 Quantity', 'Item 91 Category', 'Item 91 Subteam', 'Item 91 Price',
        'Item 92 ID', 'Item 92 Name', 'Item 92 Quantity', 'Item 92 Category', 'Item 92 Subteam', 'Item 92 Price',
        'Item 93 ID', 'Item 93 Name', 'Item 93 Quantity', 'Item 93 Category', 'Item 93 Subteam', 'Item 93 Price',
        'Item 94 ID', 'Item 94 Name', 'Item 94 Quantity', 'Item 94 Category', 'Item 94 Subteam', 'Item 94 Price',
        'Item 95 ID', 'Item 95 Name', 'Item 95 Quantity', 'Item 95 Category', 'Item 95 Subteam', 'Item 95 Price',
        'Item 96 ID', 'Item 96 Name', 'Item 96 Quantity', 'Item 96 Category', 'Item 96 Subteam', 'Item 96 Price',
        'Item 97 ID', 'Item 97 Name', 'Item 97 Quantity', 'Item 97 Category', 'Item 97 Subteam', 'Item 97 Price',
        'Item 98 ID', 'Item 98 Name', 'Item 98 Quantity', 'Item 98 Category', 'Item 98 Subteam', 'Item 98 Price',
        'Item 99 ID', 'Item 99 Name', 'Item 99 Quantity', 'Item 99 Category', 'Item 99 Subteam', 'Item 99 Price']
};

// Sort images by filename
function sortResources(arr){
  return arr.sort((a, b) => {
    if(a.filename > b.filename){
      return 1;
    }

    if(a.filename < b.filename){
      return -1;
    }

    return 0;
  });
}

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
    cb("Error","Non image type file");
  }
};

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

support.concatImages = function(){
  var args = Array.from(arguments);
  var resources = [];
  args.forEach((arg) => {
    arg.resources.forEach((resource) => {
      resources.push(resource);
    });
  });
  return sortResources(resources);
}

module.exports = support;
