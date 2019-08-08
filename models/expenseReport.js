var mongoose    = require("mongoose"),
    User        = require("./user.js"),
    ExpenseItem = require("./expenseItem.js");


var expenseReportSchema = new mongoose.Schema({
   author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
   expenseItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ExpenseItem' }],
   viewed: {type: Boolean, default: false},
   approved: {type: Boolean, default: false},
   created: { type: Date, default: Date.now },
   store: String,
   currency: String,
   subtotal: Number,
   tax: Number,
   shipping: Number,
   total: Number,
   notes: String,
   image: String,
});

module.exports = mongoose.model("ExpenseReport", expenseReportSchema);
