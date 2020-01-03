const express = require("express"),
      router  = express.Router({mergeParams: true});

const callbacks       = require("./callbacks.js");

// INDEX
router.get("/", callbacks.auth.index);

// LOGOUT
router.get("/logout", callbacks.auth.logout);

// GOOGLE
router.get("/google", callbacks.auth.google.index);
router.get("/google/callback", callbacks.auth.google.callback); // , callbacks.auth.google.success
router.get("/google/success", callbacks.auth.google.success); 

module.exports = router;
