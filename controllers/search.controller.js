const { response } = require("express");
const User = require("../models/user.model");
const Hospital = require("../models/hospital.model");
const Medic = require("../models/medic.model");

const getAll = async (req, res = response) => {
  const search = req.params.search;
  const regex = new RegExp(search, "i");

  const [users, hospitals, medics] = await Promise.all([
    User.find({ name: regex }),
    Hospital.find({ name: regex }),
    Medic.find({ name: regex }),
  ]);

  res.json({
    ok: true,
    users,
    hospitals,
    medics,
    search,
  });
};

const getDocumentsCollection = async (req, res = response) => {
  const table = req.params.table;
  const search = req.params.search;
  const regex = new RegExp(search, "i");
  let data = [];
  switch (table) {
    case "medics":
      data = await Medic.find({ name: regex })
        .populate("user", "name img")
        .populate("hospital", "name img");
      break;
    case "hospitals":
      data = await Hospital.find({ name: regex }).populate("user", "name img");
      break;
    case "users":
      data = await User.find({ name: regex });
      break;

    default:
      return res.status(400).json({
        ok: false,
        msg: "Table should be Users/Medics/Hospitals",
      });
  }

  res.json({
    ok: true,
    results: data,
  });
};

module.exports = {
  getAll,
  getDocumentsCollection,
};
