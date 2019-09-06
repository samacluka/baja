const express = require("express"),
      router  = express.Router({mergeParams: true});

const callbacks       = require("./callbacks/callbacks.js");

// Get Routes
router.get("/", callbacks.index.get.index);

router.get("/register", callbacks.index.get.register);

router.get("/login", callbacks.index.get.login);

router.get("/logout", callbacks.index.get.logout);

router.get("/sponsors", callbacks.index.get.sponsors);

router.get("/recruitment", callbacks.index.get.recruitment);

router.get("/gallery", callbacks.index.get.gallery);

//POST ROUTES
router.post("/register", callbacks.index.post.register);

router.post("/login", callbacks.index.post.login);

module.exports = router;
