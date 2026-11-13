const express = require("express");
const router = express.Router();
const controller = require("./controller");
const validator = require("./validator");
const upload = require("../../middlewares/upload");
const { isLoggined, isAdmin } = require("../../middlewares/auth");

router.get("/OfferProducts", controller.OfferProducts);
router.post(
  "/createProduct",
  isLoggined,
  isAdmin,
  upload.single("img"),
  validator.createProductValidator(),
  controller.validate,
  controller.createProduct,
);
router.get("/getSearchProduct", controller.searchProduct);
router.put(
  "/removeOneNumberToProduct",
  isLoggined,
  isAdmin,
  controller.removeOneNumberToProduct,
);
router.put(
  "/addOneNumberToProduct",
  isLoggined,
  isAdmin,
  controller.addOneNumberToProduct,
);
router.put(
  "/editProduct",
  isLoggined,
  isAdmin,
  controller.validate,
  controller.editProduct,
);

router.get(
  "/search-product-by-admin/:searchValue",
  isLoggined,
  isAdmin,
  controller.searchProductByAdmin,
);
router.get("/getProduct/:id", controller.getProductById);
router.get("/:category", controller.getCategoryProduct);

module.exports = router;
