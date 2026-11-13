const mongoose = require("mongoose");
const debug = require("debug")("app:main");
require("dotenv").config();

module.exports = function () {
  mongoose
    .connect(process.env.db)
    .then(() => console.log("connected to mongodb"))
    .catch((e) => debug(e));
};
