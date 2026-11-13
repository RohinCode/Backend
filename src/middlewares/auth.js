require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user");

async function isLoggined(req, res, next) {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({
      message: "access denied",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.jwt_key);

    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(401).json({
        message: "user not found",
      });
    }

    req.user = user;

    next();
  } catch (ex) {
    console.log(ex);
    return res.status(401).json({
      message: "invalid token",
    });
  }
}

async function isAdmin(req, res, next) {
  if (!req.user.isadmin) {
    return res.status(403).json({
      message: "access denied",
    });
  }

  next();
}

module.exports = {
  isLoggined,
  isAdmin,
};
