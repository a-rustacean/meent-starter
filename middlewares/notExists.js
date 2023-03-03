function notExists(_, res, next) {
  res.notExists = () => {
    res.status(404).send("Page not found");
  };
  next();
}

module.exports = notExists;
