mongoose = require("mongoose");
const { default: ShortUniqueId } = require("short-unique-id");

// Database URL
const DATABASE = "mongodb://localhost/short";
mongoose.connect(DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
mongoose.connection.on("error", (err) => {
  console.log("Mongoose Connection error" + err.message);
});
const app = require("./app");

mongoose.connection.once("open", () => {
  console.log("MongoDB connected");
  app.listen(process.env.PORT || 3000, () => {
    console.log("Listening on port http://localhost:" + 3000);
  });
});
