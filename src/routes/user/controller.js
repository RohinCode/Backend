const controller = require("./../controller");
const _ = require("lodash");

module.exports = new (class extends controller {
  async dashboard(req, res) {
    res.json({ message: "user dashboard" });
  }

  async me(req, res) {
    this.response({
      res,
      data: _.pick(req.user, [
        "name",
        "email",
        "address",
        "phoneNamber",
        "isadmin",
      ]),
    });
  }

  async editInfo(req, res) {
    const user = req.user;
    const { phoneNamber, address, name } = req.body;

    if (phoneNamber !== undefined) {
      if (!/^\d{11}$/.test(phoneNamber)) {
        return this.response({
          res,
          code: 400,
          message: "شماره تلفن باید ۱۱ رقم و فقط شامل عدد باشد",
        });
      }

      user.phoneNamber = phoneNamber;
    }

    if (address !== undefined) {
      user.address = address;
    }

    if (name !== undefined) {
      const isNotUnique = await this.User.findOne({
        name: name,
        _id: { $ne: user._id },
      });

      if (isNotUnique) {
        return this.response({
          res,
          message: "این نام قبلاً ثبت شده",
          code: 409,
        });
      }

      user.name = name;
    }

    await user.save();

    this.response({
      res,
      message: "اطلاعات با موفقیت ویرایش شد",
      data: user,
    });
  }
})();
