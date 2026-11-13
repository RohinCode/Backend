const controller = require("./../controller");
const _ = require("lodash");

module.exports = new (class extends controller {
  async dashboard(req, res) {
    res.json({ message: `سلام ${req.user.name}` });
  }

  async getAllUsers(req, res) {
    const users = await this.User.find().select("-password");

    if (!users.length) {
      return this.response({
        res,
        message: "هیچ کاربری نداریم",
        code: 404,
      });
    }

    this.response({ res, message: "لیست کاربران:", data: users });
  }

  async getUserByName(req, res) {
    const name = req.header("username").trim();
    const user = await this.User.findOne({ name }).select("-password");

    if (!user) {
      return this.response({
        res,
        message: "همچین کاربری نداریم",
        code: 404,
      });
    }

    this.response({ res, message: "مشخصات کاربر", data: user });
  }

  async upgrateToAdmin(req, res) {
    const name = req.body.name.trim();
    const user = await this.User.findOne({ _id: name }).select("-password");

    if (!user) {
      return this.response({
        res,
        message: "همچین کاربری نداریم",
        code: 404,
      });
    }

    user.isadmin = true;

    await user.save();

    this.response({
      res,
      message: "کاربر با موفقیت تبدیل به ادمین شد",
    });
  }

  async deleteFromAdmin(req, res) {
    const name = req.body.name.trim();
    const user = await this.User.findOne({ _id: name }).select("-password");

    if (!user) {
      return this.response({
        res,
        message: "همچین کاربری نداریم",
        code: 404,
      });
    }

    if (user.isOwner) {
      const owner = await this.User.findOne({ isOwner: true });
      const message = new this.Message({
        title: "هشدار!",
        text: `کاربر ${user.name} تلاش کرد شما را از ادمینی خارج کند!`,
        user: owner._id,
      });

      await message.save();

      return this.response({
        res,
        message: "خطا",
        code: 403,
      });
    }

    user.isadmin = false;

    await user.save();

    this.response({
      res,
      message: "کاربر با موفقیت تبدیل به کاربر عادی شد",
    });
  }

  async deleteUser(req, res) {
    const name = req.body.name.trim();
    const user = await this.User.findOne({ _id: name }).select("-password");

    if (!user) {
      return this.response({
        res,
        message: "همچین کاربری نداریم",
        code: 404,
      });
    }

    if (user.isOwner) {
      const owner = await this.User.findOne({ isOwner: true });
      const message = new this.Message({
        title: "هشدار!",
        text: `کاربر ${user.name} تلاش کرد شما را حذف کند!`,
        user: owner._id,
      });

      await message.save();

      return this.response({
        res,
        message: "خطا",
        code: 403,
      });
    }

    if (user.isadmin) {
      return this.response({
        res,
        message: "نمی‌توانید کاربری که ادمین است را حذف کنید",
        code: 403,
      });
    }

    await this.User.findByIdAndDelete(name);

    this.response({
      res,
      message: "کاربر با موفقیت حذف شد",
    });
  }

})();
