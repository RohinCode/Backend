require("dotenv").config();

function addImageDomain(req, res, next) {
  const originalJson = res.json;

  res.json = function (data) {
    if (data?.img) {
      data.img = `${process.env.sieURL}${data.img}`;
    }

    return originalJson.call(this, data);
  };

  next();
}

module.exports = addImageDomain;
