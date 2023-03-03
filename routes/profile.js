const router = require("express").Router();
const { ensureAuth } = require("@middlewares/auth");
const users = require("@models/users");

router.get("/", ensureAuth("get"), (req, res) => 
  res.render("profile.ejs", { currentUser: req.user })
);

router.get("/:username", (req, res) => {
  const username = req.params.username;
  users.findOne({ username }, (err, user) => {
    if (err || !user) return res.notExists();
    return res.render("profile.ejs", { currentUser: user, authUser: req.user });
  })
})

router.get("/setting", ensureAuth("get", { allowUnverifiedEmail: true }), (req, res) =>
  res.render("setting.ejs", { user: req.user })
);

module.exports = router;
