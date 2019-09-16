var mongoose = require("mongoose");

var optionSchema = mongoose.Schema({
    select: String,
    value: String,
    text: String,
});

module.exports = mongoose.model("Option", optionSchema);
