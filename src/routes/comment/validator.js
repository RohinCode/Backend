const expressValidator = require("express-validator");
const check = expressValidator.check;

module.exports = new (class {
  validator() {
    return [
      check("text").not().isEmpty().withMessage("کامنت نمی‌تواند خالی باشد"),
      check("text")
        .isLength({ max: 500 })
        .withMessage("کامنت نمی‌تواند بیشتر از 500 باشد"),
    ];
  }
})();
