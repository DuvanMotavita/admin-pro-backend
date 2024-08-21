const { response } = require("express");
const Medic = require("../models/medic.model");

const getMedics = async (req, res = response) => {
  const medics = await Medic.find()
    .populate("user", "name img")
    .populate("hospital", "name");

  res.json({
    ok: true,
    medics,
  });
};

const createMedics = async (req, res = response) => {
  const uid = req.uid;
  const hospitalId = req.body.hospital;
  const medic = new Medic({
    user: uid,
    hospital: hospitalId,
    ...req.body,
  });

  try {
    const medicDB = await medic.save();
    res.json({
      ok: true,
      medic: medicDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error when you tried to create a medic",
    });
  }
};

const updateMedics = (req, res = response) => {
  res.json({
    ok: true,
    msg: "updateMedics",
  });
};
const deleteMedics = (req, res = response) => {
  res.json({
    ok: true,
    msg: "deleteMedics",
  });
};

module.exports = {
  getMedics,
  createMedics,
  updateMedics,
  deleteMedics,
};
