var mongoose = require("mongoose"),
    ExpenseReport = require("./expenseReport.js");

var expenseItemSchema = mongoose.Schema({
    itemName: String,
    category: String,
    subteam: String,
    itemPrice: String,
    expenseReport:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "ExpenseReport"
                  }
});

module.exports = mongoose.model("ExpenseItem", expenseItemSchema);
