const express = require("express"),
      router  = express.Router({mergeParams: true});

const is              = require("../middleware/is.js");

const callbacks       = require("./callbacks/callbacks.js");

// GET
router.get("/", callbacks.members.get.index);
router.get("/:id", callbacks.members.get.show);
router.get("/:id/edit", is.LoggedIn, callbacks.members.get.edit);


// POST
router.get("/", is.LoggedIn, callbacks.members.post.new);

// PUT
router.get("/:id", is.LoggedIn, callbacks.members.put.save);
router.put("/:id/approve", is.Captain, callbacks.members.put.approve);
router.put("/:id/unapprove", is.Captain, callbacks.members.put.unapprove);

// DELETE
router.delete("/:id/edit", is.LoggedIn, callbacks.members.delete.remove);

module.exports = router;
