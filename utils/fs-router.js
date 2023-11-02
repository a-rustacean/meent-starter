const { readdirSync } = require("fs");
const path = require("path");

const getRootPrefix = (prefixes) => {
  for (const key in prefixes) {
    if (Object.hasOwnProperty.call(prefixes, key)) {
      const prefix = prefixes[key];
      if (prefix == "/") return key;
    }
  }
};

/**
 *
 * @param {core.Express} app express app
 * @param {string} [routeFolder="routes"] routes folder name
 * @param {{ prefixes: { [key: string]: string } }} config config
 * @param {string} [prefix="/"] prefix
 */
function applyFsRouting(
  app,
  routeFolder = "routes",
  config = {},
  prefix = "/"
) {
  readdirSync(path.join(__dirname, "..", routeFolder), {
    withFileTypes: true,
  })
    .sort((a) => (a.name === getRootPrefix(config.prefixes) + ".js" ? 1 : -1))
    .forEach((file) => {
      const route = file.name;
      const type = file[Object.getOwnPropertySymbols(file)[0]];
      if (type == 2) {
        applyFsRouting(
          app,
          routeFolder + "/" + route,
          config,
          prefix + route + "/"
        );
        return;
      }
      const name = path.parse(route).name;
      const extension = path.extname(route);
      if (extension !== ".js") return;
      const routeName = path.join(
        prefix,
        (config?.prefixes && config.prefixes[name]) || name
      );
      process.stdout.write("Connecting route " + routeName + "\n");
      app.use(
        routeName,
        require(
          __dirname
            .split("/")
            .slice(0, __dirname.split("/").length - 1)
            .join("/") +
            "/" +
            routeFolder +
            "/" +
            route
        )
      );
    });
}

module.exports = applyFsRouting;
