const express = require("express");
const router = express.Router();
const authRouter = require("./auth");
const userRouter = require("./user");
const ProductRouter = require("./product");
const CartRouter = require("./cart");
const adminRouter = require("./admin");
const reportRouter = require("./report");
const messagesRouter = require("./messages");
const commentRouter = require("./comment");
const colorsRouter = require("./colors");
const { isLoggined, isAdmin } = require("./../middlewares/auth");
const error = require("./../middlewares/error");

router.use("/auth", authRouter);

router.use("/admin", isLoggined, isAdmin, adminRouter);
router.use("/report", isLoggined, isAdmin, reportRouter);
router.use("/user", isLoggined, userRouter);
router.use("/cart", isLoggined, CartRouter);
router.use("/product", ProductRouter);
router.use("/messages", messagesRouter);
router.use("/comment", commentRouter);
router.use("/color", colorsRouter);

router.use(error);

module.exports = router;
