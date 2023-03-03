const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const users = require("@models/users");
const argon = require("argon2");

passport.serializeUser((user, done) => {
  done(null, { user: user.username, password: user.password });
});

passport.deserializeUser((obj, done) => {
  users.findOne({ usernams: obj.user }, (queryError, user) => {
    if (queryError) return done(queryError);
    if (!user) return done(null, false);
    const passwordMatch = user.password === obj.password;
    if (!passwordMatch) return done(null, false);
    return done(null, user);
  });
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async(email, password, done) => {
      try {
        const user = await users.findOne({ email });
        if (!user) return done(null, false, { message: "Weong email or password" });
        const passwordMatch = await argon.verify(user.password, password);
        if (passwordMatch) return done(null, user);
        return done(null, false, { message: "Wrong email or password" });
      } catch(e) {
        return done(e, false, { message: "Wrong email or password" });
      }
    }
  )
);
