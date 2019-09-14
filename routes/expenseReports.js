const express         = require("express"),
      router          = express.Router({mergeParams: true});

const multer          = require("../middleware/multer.js"),
      is              = require("../middleware/is.js");

const callbacks       = require("./callbacks.js");

// GET
router.get("/", is.approved, is.LoggedIn, callbacks.expenseReports.get.index);
router.get("/new", is.approved, is.Lead, callbacks.expenseReports.get.new);
router.get("/:id", is.approved, is.LoggedIn, callbacks.expenseReports.get.show); //  "/expenseReports/new" must be declared first because it follows the same pattern
router.get("/:id/edit", is.approved, is.ExpenseReportAuthor, callbacks.expenseReports.get.edit);

// POST
router.post("/", is.approved, is.LoggedIn, multer.upload, callbacks.expenseReports.post.new);

// PUT
router.put("/:id", is.approved, is.CaptainOrExpenseReportAuthor, multer.upload, callbacks.expenseReports.put.save);
router.put("/:id/approve", is.approved, is.Captain, callbacks.expenseReports.put.approve);
router.put("/:id/unapprove", is.approved, is.Captain, callbacks.expenseReports.put.unapprove);

// DELETE
router.delete("/:id", is.approved, is.CaptainOrExpenseReportAuthor,  callbacks.expenseReports.delete.remove);

module.exports = router;
