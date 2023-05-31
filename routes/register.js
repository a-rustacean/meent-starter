const router = require("express").Router();
const Joi = require("joi");
const users = require("@models/users");
const argon = require("argon2");
const connection = require("@utils/database");
const upload = require("@utils/upload");
const { createImage } = require("@utils/image");
const validImageMimeTypes = [
  "image/png",
  "image/jpeg",
  "image/svg+xml",
  "image/webp",
];

router.get("/", (_, res) => res.render("register.ejs"));

router.post("/", upload.single("profile"), async (req, res) => {
  const body = req.body;
  const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    username: Joi.string().required(),
    password: Joi.string().min(8).required(),
  });
  const { error } = userSchema.validate(body);
  if (error) {
    req.flash("error", error.details[0].message);
    return res.status(409).redirect("/register");
  }
  if (!req.file) {
    req.flash("error", "Invalid profile photo.");
    return res.status(409).redirect("/register");
  }
  if (!validImageMimeTypes.includes(req.file.mimetype)) {
    req.flash("error", "Invalid profile photo.");
    return res.status(409).redirect("/register");
  }
  const session = await connection.startSession();
  try {
    session.startTransaction();
    const userWithExistingEmail = await users
      .findOne({ email: body.email })
      .session(session);
    if (userWithExistingEmail) {
      await session.abortTransaction();
      await session.endSession();
      req.flash("error", "Email already exists.");
      return res.status(409).redirect("/register");
    }
    const userWithExistingUsername = await users
      .findOne({ username: body.username })
      .session(session);
    if (userWithExistingUsername) {
      await session.abortTransaction();
      await session.endSession();
      req.flash("error", "Username already exists.");
      return res.status(409).redirect("/register");
    }
    const password = await argon.hash(body.password);
    const profile = await createImage(req.file.buffer);
    const createdUser = (
      await users.create(
        [
          {
            email: body.email,
            username: body.username,
            password,
            name: body.name,
            profile,
          },
        ],
        { session }
      )
    )[0];
    if (!createdUser) {
      await session.abortTransaction();
      await session.endSession();
      req.flash("error", "Error creating user.");
      return res.status(502).redirect("/register");
    }
    await session.commitTransaction();
    await session.endSession();
    req.logIn(createdUser, (error) => {
      if (error) {
        req.flash("error", "Unable to login.");
        res.status(200).redirect("/login");
      }
      return res.status(200).redirect("/");
    });
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    req.flash("error", "Error creating user.");
    return res.status(403).redirect("/register");
  }
});

module.exports = router;
