const express = require("express"),
      router  = express.Router({mergeParams: true});

const callbacks       = require("./callbacks/callbacks.js");

// Get Routes

// PUT  Routes
router.put("/:id/approve", callbacks.users.put.approve);

router.put("/:id/unapprove", callbacks.users.put.unapprove);

module.exports = router;
