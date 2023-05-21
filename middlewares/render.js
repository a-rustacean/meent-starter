const { toDataUri } = require("@utils/image");

module.exports = (req, res, next) => {
  const oldRender = res.render;
  res.render = (path, options = {}) => {
    oldRender(path, {
      ...options,
      authUser: req.user,
      env: process.env,
      utils: {
        toDataUri,
      },
    });
  };
  next();
};
