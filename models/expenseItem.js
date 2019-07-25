var mongoose = require("mongoose"),
    ExpenseReport = require("./expenseReport.js");

var expenseItemSchema = mongoose.Schema({
    itemName: String,
    category: String,
    subteam: String,
    subtotal: Number,
    store: String,
    currency: String,
    tax: Number,
    shipping: Number,
    total: Number,
    image: String,
    expenseReport:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "ExpenseReport"
                  }
});

module.exports = mongoose.model("ExpenseItem", expenseItemSchema);
