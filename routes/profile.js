const router = require("express").Router();
const { ensureAuth } = require("@middlewares/auth");
const users = require("@models/users");

router.get("/", ensureAuth("get", { allowUnverifiedEmail: true }), (req, res) =>
  res.render("profile.ejs", { currentUser: req.user })
);

router.get("/:username", async (req, res) => {
  const username = req.params.username;
  const user = await users.findOne({ username });
  if (!user) return res.notExists();
  res.render("profile.ejs", { currentUser: user, authUser: req.user });
});

module.exports = router;
