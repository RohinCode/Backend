const controller = require("../controller");

module.exports = new (class extends controller {
  async getColor(req, res) {
    const color = await this.Color.findOne();

    if (!color) {
      return this.response({ res, code: 404, message: "هیچ رنگی نداریم" });
    }

    this.response({ res, data: color, message: "رنگ انتخابی" });
  }

  async editColor(req, res) {
    const { name } = req.body;
    const color = await this.Color.findOne();

    if (!color) {
      return this.response({ res, code: 404, message: "هیچ رنگی نداریم" });
    }

    color.name = name;
    await color.save();
    this.response({ res, message: "با موفقیت انجام شد", data: color });
  }

  async createColor(req, res) {
    const { name } = req.body;
    const color = await this.Color.findOne();

    if (color) {
      return this.response({ res, code: 409, message: "قبلا ساخته شده" });
    }

    const newColor = new this.Color({
      name: name,
    });

    await newColor.save();

    this.response({ res, message: "با موفقیت ساخته شد", data: newColor });
  }
})();
