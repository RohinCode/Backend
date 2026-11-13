const express = require("express");
const router = express.Router();
const controller = require("./controller");
router.delete("/", controller.delete);
router.get("/", controller.report);
module.exports = router;
