function ensureAuth(type) {
  return function (req, res, next) {
    if (!req.user) {
      if (type === "get") {
        return res.status(401).send("Not authenticated");
      } else {
        return res.status(403).json({
          success: false,
          error: {
            message: "Not authenticated",
          },
        });
      }
    }
    next();
  };
}

module.exports = { ensureAuth };
