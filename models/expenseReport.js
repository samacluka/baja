var mongoose    = require("mongoose"),
    User        = require("./user.js"),
    ExpenseItem = require("./expenseItem.js");


var expenseReportSchema = new mongoose.Schema({
   author:{
             type: mongoose.Schema.Types.ObjectId,
             ref: "User"
          },
   expenseItems: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "ExpenseItem"
      }
   ]
});

module.exports = mongoose.model("ExpenseReport", expenseReportSchema);
