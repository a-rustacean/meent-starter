const Express = require("express");
const path = require("path");
const { readdirSync, existsSync } = require("fs");
const passport = require("passport");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const config = require("@config");
const applyFsRouting = require("@utils/fs-router");
const app = Express();

require("./utils/passport");

app.use(Express.static(__dirname + "/public"));
app.use(Express.json({ limit: "100mb" }));
app.use(Express.urlencoded({ limit: "100mb", extended: false }));
app.use(require("express-log-url"));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(require("./utils/session"));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", process.env.CORS_DOMAIN);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,PATCH,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );
  next();
});

app.set("view engine", "ejs");
app.set("views", "views");
app.set(
  "log.username",
  (req) => (req.ip ? req.ip + " " : "") + (req.user?.name || "")
);
app.set("trust proxy", 1);

existsSync(path.join(__dirname, "middlewares")) &&
  readdirSync(path.join(__dirname, "middlewares"), { withFileTypes: true })
    .filter((file) => file[Object.getOwnPropertySymbols(file)[0]] == 1)
    .forEach(({ name: middleware }) => {
      process.stdout.write(
        "Connecting middleware " + path.parse(middleware).name + "\n"
      );
      app.use(require("./middlewares/" + middleware));
    });
applyFsRouting(app, "routes", config.express.routes);

app.get("*", (_, response) => response.notExists());

module.exports = app;
