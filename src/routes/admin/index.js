const express = require("express");
const router = express.Router();
const controller = require("./controller");

router.get("/getAllUsers", controller.getAllUsers);
router.get("/get-user-by-name", controller.getUserByName);
router.put("/upgrade-to-admin", controller.upgrateToAdmin);
router.put("/delete-from-admin", controller.deleteFromAdmin);
router.put("/delete-user", controller.deleteUser);


router.get("/", controller.dashboard);

module.exports = router;
