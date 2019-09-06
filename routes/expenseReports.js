const express         = require("express"),
      router          = express.Router({mergeParams: true});

const multer          = require("../middleware/multer.js"),
      auth            = require("../middleware/auth.js");

const callbacks       = require("./callbacks/callbacks.js");

// // GET
router.get("/", callbacks.expenseReports.get.index);
router.get("/new", auth.isLoggedIn, callbacks.expenseReports.get.new);
router.get("/:id", callbacks.expenseReports.get.show); //  "/expenseReports/new" must be declared first because it follows the same pattern
router.get("/:id/edit", auth.isExpenseReportAuthor, callbacks.expenseReports.get.edit);

// POST
router.post("/", auth.isLoggedIn, multer.upload, callbacks.expenseReports.post.new);

// PUT
router.put("/:id", callbacks.expenseReports.put.save);
router.put("/:id/approve", callbacks.expenseReports.put.approve);
router.put("/:id/unapprove", callbacks.expenseReports.put.unapprove);

// DELETE
router.delete("/:id", auth.isExpenseReportAuthor,  callbacks.expenseReports.delete.remove);

module.exports = router;
