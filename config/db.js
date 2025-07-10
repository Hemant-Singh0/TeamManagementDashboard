const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.DB_HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.set("debug", true);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));

db.once("open", function () {
  console.log(`MongoDB Connected Successfully to Server 🚀`);
});

module.exports = mongoose;
