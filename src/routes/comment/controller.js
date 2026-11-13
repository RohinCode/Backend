const controller = require("../controller");

module.exports = new (class extends controller {
  async writeComment(req, res) {
    const productId = req.body.productId;
    const user = await this.Comment.find({
      user: req.user._id,
      product: productId,
    });
    if (user.length >= 3) {
      return this.response({
        res,
        message: "هر کاربر برای هر محصول فقط می‌تواند سه نظر دهد",
        code: 400,
      });
    }

    console.log(req.user._id);
    console.log(req.body.text);
    console.log(productId);

    const comment = new this.Comment({
      user: req.user._id,
      product: productId,
      text: req.body.text,
    });

    await comment.save();

    return this.response({
      res,
      message: "با موفقیت ثبت شد",
      data: comment,
    });
  }

  async getComment(req, res) {
    const productId = req.params.productId;
    const comments = await this.Comment.find({ product: productId }).populate(
      "user",
      "-password -address -phoneNumber -isadmin",
    );

    if (comments.length === 0) {
      return this.response({
        res,
        message: "نظری برای این محصول یافت نشد",
        code: 404,
      });
    }

    this.response({
      res,
      message: "لیست نظرات این محصول",
      data: comments,
    });
  }
})();
