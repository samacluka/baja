const express = require("express"),
      router  = express.Router({mergeParams: true});

const multer          = require("../middleware/multer.js"),
      is              = require("../middleware/is.js");

const callbacks       = require("./callbacks.js");

// GET
router.get("/", callbacks.members.get.index);
router.get("/:id", callbacks.members.get.show);
router.get("/:id/edit", is.CaptainOrMember, callbacks.members.get.edit);


// POST
// PUT
router.put("/:id", is.CaptainOrMember, multer.upload, callbacks.members.put.save);
router.put("/:id/approve", is.Captain, callbacks.members.put.approve);
router.put("/:id/unapprove", is.Captain, callbacks.members.put.unapprove);

// DELETE
router.delete("/:id", is.Captain, callbacks.members.delete.remove);

module.exports = router;
