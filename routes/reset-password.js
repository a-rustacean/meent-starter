const users = require("@models/users");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const nodify = require("@utils/nodify");
const Joi = require("joi");
const argon = require("argon2");

router.get("/:token", async (req, res) => {
  let email = null;
  try {
    email = jwt.verify(
      req.params.token,
      process.env.JWT_RESET_PASSWORD_EMAIL_TOKEN
    ).email;
  } catch {
    /* do nothing */
  }
  if (!email) return res.status(409).send("Invalid or expired link");
  const existingUser = await users.findOne({
    email,
  });
  if (!existingUser) return res.status(404).send("User not found");
  if (existingUser.lastResetPasswordToken == req.params.token)
    return res.status(409).send("Invalid or expired link");
  res.render("reset-password.ejs", { token: req.params.token });
});

router.post("/:token", async (req, res) => {
  let email = null;
  try {
    email = jwt.verify(
      req.params.token,
      process.env.JWT_RESET_PASSWORD_EMAIL_TOKEN
    ).email;
  } catch {
    /* do nothing */
  }
  if (!email) {
    req.flash("error", "Invalid or expired token");
    return res.redirect("/reset-password/" + req.params.token);
  }
  const resetPasswordSchema = Joi.object({
    password: Joi.string().min(8).required(),
  });
  const { error } = resetPasswordSchema.validate(req.body);
  if (error) {
    req.flash("error", error.details[0].message);
    return res.redirect("/reset-password/" + req.params.token);
  }
  const existingUser = await users.findOne({
    email,
  });
  if (!existingUser) {
    req.flash("error", "User not found");
    return res.redirect("/reset-password/" + req.params.token);
  }
  if (existingUser.lastResetPasswordToken == req.params.token) {
    req.flash("error", "Invalid or expired token");
    return res.redirect("/reset-password/" + req.params.token);
  }
  existingUser.lastResetPasswordToken = req.params.token;
  if (!existingUser.emailVerified) {
    existingUser.emailVerified = true;
  }
  nodify(argon.hash(req.body.password), (hashingError, password) => {
    if (hashingError || !password) {
      req.flash("error", "Unable to update password");
      return res.redirect("/reset-password/" + req.params.token);
    }
    existingUser.password = password;
    nodify(existingUser.save(), (savingError) => {
      if (savingError) {
        req.flash("error", "Unable to update password");
        return res.redirect("/reset-password/" + req.params.token);
      }
      return req.logIn(existingUser, () => {
        return res.redirect("/");
      });
    });
  });
});

module.exports = router;
