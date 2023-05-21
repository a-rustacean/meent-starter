const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.on("error", (e) => {
  process.stderr.write("Database connection error\n" + e + "\n");
  process.exit(1);
});

connection.on("open", () => {
  process.stdout.write("Successfully connected to the database\n");
});

module.exports = connection;
