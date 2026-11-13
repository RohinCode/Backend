const controller = require("../controller");

module.exports = new (class extends controller {
  async report(req, res) {
    const report = await this.Report.find();

    if (report.length == 0) {
      return this.response({ res, message: "گزارشی نداریم", code: 400 });
    }

    this.response({ res, message: "لیست گزارشات", data: report });
  }

  async delete(req, res) {
    const report = await this.Report.deleteMany({});

    if (report.deletedCount == 0) {
      return this.response({ res, message: "گزارشی نداریم", code: 400 });
    }

    this.response({ res, message: "لیست گزارشات", data: report });
  }
})();
