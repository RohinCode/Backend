const express = require("express");
const app = express();

const router = require("./src/routes");
require("./startup/config")(app, express);
require("./startup/db")();
require("./startup/logging")();
const cors= require("cors")
app.use(cors())
app.use("/api", router);

const port = process.env.PORT || 7777;
app.listen(port,"0.0.0.0", () => console.log(`listening on port ${port}`));