// const path = require("path");
// const { existsSync, readFileSync } = require("fs");
// const moduleAlias = require("module-alias");

// if (existsSync(path.join(__dirname, "jsconfig.json"))) {
//   try {
//     const jsConfig = JSON.parse(
//       readFileSync(path.join(__dirname, "jsconfig.json")).toString()
//     );
//     const paths = jsConfig.compilerOptions.paths;
//     const aliases = {};
//     for (const key in paths) {
//       if (Object.hasOwnProperty.call(paths, key)) {
//         const path = paths[key];
//         const alias = __dirname + "/" + path[0];
//         aliases[key] = alias;
//         process.stdout.write("Setting aliaas: " + key + " -> " + alias + "\n");
//       }
//     }
//     moduleAlias.addAliases(aliases);
//   } catch (e) {
//     process.stdout.write("Error setting alias" + e + "\n");
//   }
// }

process.env.NODE_ENV ||= "development";
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
process.stdout.write(`Using env file .env.${process.env.NODE_ENV}\n`);
const applyJsconfigAlias = require("./utils/jsconfig-alias");
applyJsconfigAlias("jsconfig.json");
require("./utils/database");

const app = require("./server");

/** @type {number} */
const port = Number(process.env.PORT || 3000);

app.set("port", port);

app.listen(port, () => {
  process.stdout.write("Listening at http://localhost:" + port + "\n");
  process.stdout.write(`Using ${process.env.NODE_ENV} environment\n`);
});
