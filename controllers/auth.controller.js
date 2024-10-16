const { response } = require("express");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { generateJWT } = require("../helpers/jwt");
const { googleVerify } = require("../helpers/google-verify");
const { getMenuFrontEnd } = require("../helpers/menu-frontend");

const login = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    //Validate email
    const userDb = await User.findOne({ email });
    if (!userDb) {
      return res.status(404).json({
        ok: false,
        msg: "Email is not correct.",
      });
    }

    //Validate password
    const validPassword = bcrypt.compareSync(password, userDb.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Password is not correct.",
      });
    }

    //Generate web token
    const token = await generateJWT(userDb.id);

    res.status(200).json({
      ok: true,
      token,
      menu: getMenuFrontEnd(userDb.role),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Something is wrong on login process",
    });
  }
};
const googleSignIn = async (req, res = response) => {
  try {
    const { email, name, picture } = await googleVerify(req.body.token);

    const userDb = await User.findOne({ email });
    let user;
    if (!userDb) {
      user = new User({
        name,
        email,
        password: "@@@",
        img: picture,
        google: true,
      });
    } else {
      user = userDb;
      user.google = true;
    }
    //Saving user
    await user.save();
    //Generate web token
    const token = await generateJWT(user.id);
    res.json({
      ok: true,
      email,
      name,
      picture,
      token,
      menu: getMenuFrontEnd(user.role),
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: "Google token is not correct.",
    });
  }

  // res.status(200).json({
  //   ok: true,
  //   msg: req.body.token,
  // });
};

const renewToken = async (req, res = response) => {
  const uid = req.uid;

  //Generate web token
  const token = await generateJWT(uid);
  //Get user by UID
  const user = await User.findById(uid);
  if (!user) {
    return res.status(404).json({
      ok: false,
      msg: "User not found.",
    });
  }
  res.json({
    ok: true,
    token,
    user,
    menu: getMenuFrontEnd(user.role),
  });
};

module.exports = { login, googleSignIn, renewToken };
