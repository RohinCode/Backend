const express = require("express");
const router = express.Router();
const controller = require("./controller");
const validator = require("./validator");
const { isLoggined, isAdmin } = require("../../middlewares/auth");
router.get("/get-color", controller.getColor);
router.put(
  "/edit-color",
  isLoggined,
  isAdmin,
  validator.validator(),
  controller.validate,
  controller.editColor,
);
router.post(
  "/create-color",
  isLoggined,
  isAdmin,
  validator.validator(),
  controller.validate,
  controller.createColor,
);

module.exports = router;
