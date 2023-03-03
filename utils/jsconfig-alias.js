const path = require("path");
const { readFileSync } = require("fs");
const moduleAlias = require("module-alias");

/**
 * 
 * @param {string} jsconfigPath path to the jsconfig.json file
 */
function applyJsconfigAlias(jsconfigPath) {
  try {
    const jsConfig = JSON.parse(
      readFileSync(path.join(__dirname, "..", jsconfigPath)).toString()
    );
    const paths = jsConfig.compilerOptions.paths;
    const aliases = {};
    for (const key in paths) {
      if (Object.hasOwnProperty.call(paths, key)) {
        const path = paths[key];
        const alias = __dirname.split("/").splice(0, __dirname.split("/").length - 1).join("/") + "/" + path[0];
        aliases[key] = alias;
        process.stdout.write(
          "Setting aliaas: " + key + " -> " + alias + "\n"
        );
      }
    }
    moduleAlias.addAliases(aliases);
  } catch (e) {
    process.stdout.write("Error setting alias" + e + "\n");
  }
}

module.exports = applyJsconfigAlias;
