const express = require("express");
const router = express.Router();
const controller = require("./controller");
const { isLoggined } = require("../../middlewares/auth");

router.get("/getMyMessages", isLoggined, controller.getMyMessages);
router.post("/createMessage", controller.createMessage);

module.exports = router;
