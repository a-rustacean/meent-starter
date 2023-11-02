const ejs = require("ejs");
const path = require("path");
const { extension } = require("./file");

async function render(filename, args, options = {}) {
  return await new Promise((resolve, reject) => {
    ejs.renderFile(
      path.join(
        options.views || "views",
        extension(filename) ? filename : filename + ".ejs"
      ),
      args,
      {},
      (err, template) => {
        if (err) return reject(err);
        resolve(template);
      }
    );
  });
}

module.exports = render;
