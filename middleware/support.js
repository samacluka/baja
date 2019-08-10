const middleware = {};

// Checks filetypes of uploaded images
middleware.checkFileType = function(req, file, cb){
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
middleware.organizeItemData = function(data){
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

module.exports = middleware;
