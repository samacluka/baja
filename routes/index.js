const express = require("express"),
      router  = express.Router({mergeParams: true});

const callbacks       = require("./callbacks/callbacks.js");

// GET
router.get("/", callbacks.index.get.index);

router.get("/sponsors", callbacks.index.get.sponsors);

router.get("/recruitment", callbacks.index.get.recruitment);

router.get("/albums", callbacks.index.get.albums);

router.get("/albums/:folder", callbacks.index.get.album_content)

module.exports = router;
