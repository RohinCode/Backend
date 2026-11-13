const express = require("express");
const router = express.Router();
const controller = require("./controller");
const validator = require("./validator");
const { isLoggined, isAdmin } = require("../../middlewares/auth");

router.post(
  "/write",
  isLoggined,
  validator.validator(),
  controller.validate,
  controller.writeComment,
);
router.get("/getComment/:productId", controller.getComment);

module.exports = router;
