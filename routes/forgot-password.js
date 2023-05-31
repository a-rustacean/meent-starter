const users = require("@models/users");
const { sendResetPasswordEmail } = require("@utils/mail");
const nodify = require("@utils/nodify");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const router = require("express").Router();

router.get("/", (_, res) => res.render("forgot-password.ejs"));

router.post("/", (req, res) => {
  const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
  });

  const { error } = forgotPasswordSchema.validate(req.body);

  if (error) {
    req.flash("error", error.details[0].message);
    return res.redirect("/forgot-password");
  }

  users.findOne(
    {
      email: req.body.email,
    },
    (queryError, user) => {
      if (queryError || !user) {
        req.flash("error", "No user found with that email.");
        return res.redirect("/forgot-password");
      }
      if (
        new Date(user.lastResetPasswordEmailSentAt).getTime() +
          process.env.RESET_PASSWORD_TIMER * 60000 >
        Date.now()
      ) {
        req.flash(
          "error",
          `Please wait ${
            process.env.RESET_PASSWORD_TIMER == 1
              ? "1 minute"
              : process.env.RESET_PASSWORD_TIMER + " minutes"
          } before making another request`
        );
        return res.redirect("/forgot-password");
      }
      const token = jwt.sign(
        {
          email: user.email,
        },
        process.env.JWT_RESET_PASSWORD_EMAIL_TOKEN,
        {
          expiresIn: process.env.RESET_PASSWORD_EMAIL_EXPIRATION + "m",
        }
      );
      sendResetPasswordEmail(user, token, (sendingError, _emailInfo) => {
        if (sendingError) {
          req.flash("error", "Error sending password reset email.");
          return res.redirect("/forgot-password");
        }
        user.lastResetPasswordEmailSentAt = Date.now();
        nodify(user.save(), () => {
          req.flash("success", "Password reset email sent to your email.");
          return res.redirect("/forgot-password");
        });
      });
    }
  );
});

module.exports = router;
