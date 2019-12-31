const express = require("express"),
      router  = express.Router({mergeParams: true});

const callbacks       = require("./callbacks.js");

// GET
router.get("/", callbacks.index.get.index);

router.get("/post/:id", callbacks.index.get.post);

router.get("/sponsors", callbacks.index.get.sponsors);

router.get("/recruitment", callbacks.index.get.recruitment);

router.get("/gallery", callbacks.index.get.gallery);

router.get("/gallery/:folder", callbacks.index.get.photos)

module.exports = router;
