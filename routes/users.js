const express = require("express"),
      router  = express.Router({mergeParams: true});

const auth            = require("../middleware/auth.js");

const callbacks       = require("./callbacks/callbacks.js");

// GET
router.get("/", auth.isLoggedIn, callbacks.users.get.index);
router.get("/new", auth.isLoggedIn, callbacks.users.get.new);
router.get("/:id", auth.isLoggedIn, callbacks.users.get.show);
router.get("/:id/edit", auth.isLoggedIn, callbacks.users.get.edit);


// POST
router.get("/", auth.isLoggedIn, callbacks.users.post.new);

// PUT
router.get("/:id", auth.isLoggedIn, callbacks.users.put.save);
router.put("/:id/approve", auth.isLoggedIn, callbacks.users.put.approve);
router.put("/:id/unapprove", auth.isLoggedIn, callbacks.users.put.unapprove);

// DELETE
router.delete("/:id/edit", auth.isLoggedIn, callbacks.users.delete.remove);

module.exports = router;
