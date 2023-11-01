const users = require("@models/users");
const jwt = require("jsonwebtoken");
const { sendVerifyEmail } = require("@utils/mail");
const router = require("express").Router();
const nodify = require("@utils/nodify");

router.get("/:token", async (req, res) => {
  let email = null;
  try {
    email = jwt.verify(
      req.params.token,
      process.env.JWT_VERIFY_EMAIL_TOKEN
    ).email;
  } catch {}
  if (!email) return res.status(409).send("Invalid or expired link");
  const existingUser = await users.findOne({
    email,
  });
  if (!existingUser) return res.status(404).send("User not found");
  if (existingUser.emailVerified)
    return res.status(403).send("Email is already verified");
  existingUser.emailVerified = true;
  nodify(existingUser.save(), (savingError) => {
    if (savingError)
      return res.status(502).send("Error updaing records please try again");
    if (!req.user)
      return req.logIn(existingUser, () => {
        res.redirect("/");
      });
    return res.redirect("/");
  });
});

router.post("/", (req, res) => {
  if (!req.user)
    return res.status(401).json({
      success: false,
      error: {
        message: "Not authenticated",
      },
    });
  if (req.user.emailVerified)
    return res.status(502).json({
      success: false,
      error: {
        message: "Your email is already verified",
      },
    });
  if (
    new Date(req.user.lastVerifyEmailSentAt).getTime() +
      process.env.VERIFY_EMAIL_TIMER * 60000 >
    Date.now()
  ) {
    return res.status(409).json({
      success: false,
      error: {
        message: `Please wait ${
          process.env.VERIFY_EMAIL_TIMER == 1
            ? "1 minute"
            : process.env.VERIFY_EMAIL_TIMER + " minutes"
        } before making another request`,
      },
    });
  }
  const verifyEmailToken = jwt.sign(
    {
      email: req.user.email,
    },
    process.env.JWT_VERIFY_EMAIL_TOKEN,
    {
      expiresIn: process.env.VERIFY_EMAIL_EXPIRATION + "m",
    }
  );
  sendVerifyEmail(req.user, verifyEmailToken, (sendingError, _emailInfo) => {
    if (sendingError)
      return res.status(502).json({
        success: false,
        error: {
          message: "Unable to send verify email. Please try again",
        },
      });
    req.user.lastVerifyEmailSentAt = Date.now();
    req.user.save().then(() => {
      res.status(200).json({
        success: true,
      });
    });
  });
});

module.exports = router;
