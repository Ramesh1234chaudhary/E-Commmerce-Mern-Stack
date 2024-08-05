const JWT = require('jsonwebtoken');
const usermodel = require('../models/userModels');

// Protected route middleware
const requiresignIn = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).send({ success: false, message: "Authorization header missing" });
    }
    const decoded = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).send({ success: false, message: "Invalid or expired token" });
  }
};

// Admin check middleware
const isAdmin = async (req, res, next) => {
  try {
    const user = await usermodel.findById(req.user._id);
    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized access"
      });
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = { requiresignIn, isAdmin };

