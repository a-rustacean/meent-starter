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
