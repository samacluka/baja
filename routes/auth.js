const express = require("express"),
      router  = express.Router({mergeParams: true});

const callbacks       = require("./callbacks.js");

// INDEX
router.get("/", callbacks.auth.index);

// LOGOUT
router.get("/logout", callbacks.auth.logout);

// GOOGLE
router.get("/google", callbacks.auth.google.index);
router.get("/google/callback", callbacks.auth.google.callback, callbacks.auth.google.success);

// LOCAL
// router.get("/local/signup", callbacks.auth.local.signup);
// router.post("/local/create", callbacks.auth.local.create);
//
// router.get("/local", callbacks.auth.local.login);
// router.get("/local/callback", callbacks.auth.local.callback, callbacks.auth.local.success);

module.exports = router;
