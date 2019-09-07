const express         = require("express"),
      router          = express.Router({mergeParams: true});

const multer          = require("../middleware/multer.js"),
      is              = require("../middleware/is.js");

const callbacks       = require("./callbacks/callbacks.js");

// GET
router.get("/", is.LoggedIn, callbacks.expenseReports.get.index);
router.get("/new", is.Lead, callbacks.expenseReports.get.new);
router.get("/:id", is.LoggedIn, callbacks.expenseReports.get.show); //  "/expenseReports/new" must be declared first because it follows the same pattern
router.get("/:id/edit", is.ExpenseReportAuthor, callbacks.expenseReports.get.edit);

// POST
router.post("/", is.LoggedIn, multer.upload, callbacks.expenseReports.post.new);

// PUT
router.put("/:id", is.LoggedIn, callbacks.expenseReports.put.save);
router.put("/:id/approve", is.LoggedIn, callbacks.expenseReports.put.approve);
router.put("/:id/unapprove", is.LoggedIn, callbacks.expenseReports.put.unapprove);

// DELETE
router.delete("/:id", is.ExpenseReportAuthor,  callbacks.expenseReports.delete.remove);

module.exports = router;
