const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions",
});

store.on("error", (error) => {
  process.stdout.write("Error on store:", error);
});

module.exports = require("express-session")({
  key: process.env.SESSION_KEY,
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    domain: process.env.COOKIE_DOMAIN,
    httpOnly: true,
    secure: false,
  },
  store,
  resave: true,
  saveUninitialized: true,
});
