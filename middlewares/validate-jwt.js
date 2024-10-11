const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const validateJWT = (req, res, next) => {
  //Reading token
  const token = req.header("x-token");
  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "Token is missing on request",
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    req.uid = uid;
    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "Token isnt correct",
    });
  }
};

const validateAdminRole = async (req, res, next) => {
  const uid = req.uid;
  try {
    const userDb = await User.findById(uid);
    if (!userDb) {
      return res.status(404).json({
        ok: false,
        msg: "User doesnt exists",
      });
    }

    if (userDb.role !== "ADMIN_ROLE") {
      return res.status(403).json({
        ok: false,
        msg: "You dont have access to do this",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Contact Admin",
    });
  }
};

const validateAdminRoleSameUser = async (req, res, next) => {
  const uid = req.uid;
  const id = req.params.id;

  try {
    const userDb = await User.findById(uid);
    if (!userDb) {
      return res.status(404).json({
        ok: false,
        msg: "User doesnt exists",
      });
    }

    if (userDb.role === "ADMIN_ROLE" || uid === id) {
      next();
    } else {
      return res.status(403).json({
        ok: false,
        msg: "You dont have access to do this",
      });
    }
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Contact Admin",
    });
  }
};

module.exports = {
  validateJWT,
  validateAdminRole,
  validateAdminRoleSameUser,
};
