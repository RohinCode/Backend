const controller = require("./../controller");
const _ = require("lodash");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = new (class extends controller {
  async register(req, res) {
    let user = await this.User.findOne({ email: req.body.email });
    if (user) {
      return this.response({
        res,
        code: 400,
        message: "این کاربر قبلا ثبت‌نام کرده",
      });
    }

    user = await this.User.findOne({ name: req.body.name });
    if (user) {
      return this.response({
        res,
        code: 400,
        message: "این نام کاربری قبلا انتخاب شده",
      });
    }

    user = new this.User(_.pick(req.body, ["name", "email", "password"]));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = jwt.sign({ _id: user.id }, process.env.jwt_key);

    const message = new this.Message({
      title: "خوش اومدی!",
      text: ` سلام ${user.name}، به جمع ما خوش اومدی. حسابت با موفقیت ساخته شد. حالا می‌تونی یه گشتی تو سایت بزنی و محصولات موردنظرت رو پیدا کنی. امیدواریم تجربه خوبی داشته باشی.`,
      user: user._id,
    });

    await message.save();

    this.response({
      res,
      message: "کاربر با موفقیت وارد شد",
      data: { token, user: _.pick(user, ["_id", "name", "email"]) },
    });
  }

  async login(req, res) {
    const user = await this.User.findOne({ name: req.body.name });
    if (!user) {
      return this.response({
        res,
        code: 400,
        message: "نام کاربری یا رمز عبور صحیح نیست",
      });
    }
    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) {
      return this.response({
        res,
        code: 400,
        message: "نام کاربری یا رمز عبور صحیح نیست",
      });
    }
    const token = jwt.sign({ _id: user.id }, process.env.jwt_key);

    const message = new this.Message({
      title: "خوش‌برگشتی",
      text: `سلام ${user.name}. خوش برگشتی. می‌تونی یه گشتی تو سایت بزنی و سفارشت رو ثبت کنی.`,
      user: user._id,
    });

    await message.save();

    this.response({
      res,
      message: "ورود موفقت آمیز",
      data: { token, user: _.pick(user, ["_id", "name", "email"]) },
    });
  }

  async adminLogin(req, res) {
    const user = await this.User.findOne({ name: req.body.name });

    if (!user) {
      return this.response({
        res,
        code: 400,
        message: "نام کاربری یا رمز عبور صحیح نیست",
      });
    }

    const isValid = await bcrypt.compare(req.body.password, user.password);

    if (!isValid) {
      return this.response({
        res,
        code: 400,
        message: "نام کاربری یا رمز عبور صحیح نیست",
      });
    }

    if (!user.isadmin) {
      return this.response({
        res,
        code: 403,
        message: "داداش. ادمین نیستی",
      });
    }

    const token = jwt.sign({ _id: user.id }, process.env.jwt_key);

    const message = new this.Message({
      title: "خوش اومدی!",
      text: `خوش اومدی به پنل مدیریت، ${user.name} 👋

اینجا می‌تونی محصولات، سفارش‌ها و بخش‌های مختلف سایت رو مدیریت کنی.
قبل از انجام هر تغییر، از درست بودن اطلاعات مطمئن شو.`,
      user: user._id,
    });

    message.save();

    this.response({
      res,
      message: "ورود ادمین موفقیت آمیز",
      data: { token },
    });
  }
})();
