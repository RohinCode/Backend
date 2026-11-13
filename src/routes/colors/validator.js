const expressValidator = require("express-validator");
const check = expressValidator.check;

module.exports = new (class {
  validator() {
    return [
      check("name")
        .isIn(["blue", "green", "pink", "yellow", "orange", "purple", "gray"])
        .withMessage("رنگ انتخاب‌شده معتبر نیست"),
    ];
  }
})();
