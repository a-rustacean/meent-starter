/**
 *
 * @param {string} type method type
 * @param {{ allowUnverifiedEmail?: boolean }} [config={}] config
 */
function ensureAuth(type, config={}) {
  const {
    allowUnverifiedEmail
  } = config;
  return function (req, res, next) {
    if (!req.user && (!allowUnverifiedEmail || req.user.emailVerified)) {
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
