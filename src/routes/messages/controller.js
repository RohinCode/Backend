const controller = require("./../controller");
module.exports = new (class extends controller {
  async createMessage(req, res) {
    const message = await new this.Message({
      title: req.body.title,
      text: req.body.text,
      user: req.body.id,
    });

    await message.save();

    this.response({
      res,
      message: "پیام فرستاده شده",
      data: message,
    });
  }

  async getMyMessages(req, res) {
    const message = await this.Message.find({
      user: req.user._id,
    });
    if (message.length == 0) {
      return this.response({
        res,
        message: "شما هیچ پیامی ندارید",
        code: 404,
      });
    }

    this.response({
      res,
      message: "پیام‌های شما",
      data: message,
    });
  }
})();
