const express = require("express"),
      router  = express.Router({mergeParams: true});

const is              = require("../middleware/is.js");

const callbacks       = require("./callbacks/callbacks.js");

// GET
router.get("/", is.LoggedIn, callbacks.users.get.index);
router.get("/new", is.LoggedIn, callbacks.users.get.new);
router.get("/:id", is.LoggedIn, callbacks.users.get.show);
router.get("/:id/edit", is.LoggedIn, callbacks.users.get.edit);


// POST
router.get("/", is.LoggedIn, callbacks.users.post.new);

// PUT
router.get("/:id", is.LoggedIn, callbacks.users.put.save);
router.put("/:id/approve", is.LoggedIn, callbacks.users.put.approve);
router.put("/:id/unapprove", is.LoggedIn, callbacks.users.put.unapprove);

// DELETE
router.delete("/:id/edit", is.LoggedIn, callbacks.users.delete.remove);

module.exports = router;
