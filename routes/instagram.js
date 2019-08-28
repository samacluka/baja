const express   = require("express"),
      router    = express.Router({mergeParams: true}),
      Instagram = require("node-instagram");

// Your redirect url where you will handle the code param
const redirectUri = 'http://localhost:3000/instagram/auth/instagram/callback';

// Create a new instance.
const instagram = new Instagram({
  clientId: process.env.INSTAGRAM_CLIENT_ID,
  clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
});

// First redirect user to instagram oauth
router.get('/auth/instagram', (req, res) => {
  res.redirect(
    instagram.getAuthorizationUrl(
      redirectUri,
      {
        // an array of scopes
        scope: ['basic'],
      }
    )
  );
});

// Handle auth code and get access_token for user
router.get('/auth/instagram/callback', async (req, res) => {
  try {
    // The code from the request, here req.query.code for express
    const code = req.query.code;
    const data = await instagram.authorizeUser(code, redirectUri);
    // data.access_token contain the user access_token
    res.json(data);
  } catch (err) {
    res.json(err);
  }
});

module.exports = router;
