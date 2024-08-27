const { response } = require("express");
const User = require("../models/user.model");

const bcrypt = require("bcryptjs");
const { generateJWT } = require("../helpers/jwt");

const getUsers = async (req, res) => {
  const from = Number(req.query.from) || 0;

  //   const user = await User.find({}, "name email role google")
  //     .skip(from)
  //     .limit(5);

  //   const total = await User.countDocuments();

  const [user, total] = await Promise.all([
    User.find({}, "name email role google img").skip(from).limit(5),
    User.countDocuments(),
  ]);

  res.json({
    ok: true,
    user,
    uid: req.uid,
    total,
  });
};
const createUser = async (req, res = response) => {
  const { email, password, name } = req.body;

  try {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({
        ok: false,
        msg: "Email already exists",
      });
    }
    const user = new User(req.body);
    //Encrypt password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);
    //Save user data
    await user.save();
    //Generate web token
    const token = await generateJWT(user.id);
    res.json({
      ok: true,
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Something is wrong..... reference logs",
    });
  }
};

const updateUser = async (req, res = response) => {
  const uid = req.params.id;

  try {
    const userDb = await User.findById(uid);
    if (!userDb) {
      return res.status(404).json({
        ok: false,
        msg: "User not found.",
      });
    }
    //Updates
    const { password, google, email, ...fields } = req.body;
    if (userDb.email !== email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          ok: false,
          msg: "Email already exists.",
        });
      }
    }
    if (!userDb.google) {
      fields.email = email;
    } else if (userDb.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: "Google users cannot change the email.",
      });
    }

    const userUpdated = await User.findByIdAndUpdate(uid, fields, {
      new: true,
    });

    res.json({
      ok: true,
      user: userUpdated,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Something is wrong on update user process.",
    });
  }
};

const deleteUser = async (req, res = response) => {
  const uid = req.params.id;
  try {
    const userDb = await User.findById(uid);
    if (!userDb) {
      return res.status(404).json({
        ok: false,
        msg: "User not found.",
      });
    }

    await User.findByIdAndDelete(uid);

    res.status(200).json({
      ok: true,
      msg: "User was delete correctly",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Something is wrong on delete user process.",
    });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
