const { response } = require("express");
const Hospital = require("../models/hospital.model");

const getHospitals = async (req, res = response) => {
  const hospitals = await Hospital.find().populate("user", "name img");
  res.json({
    ok: true,
    hospitals,
  });
};

const createHospitals = async (req, res = response) => {
  const uid = req.uid;
  const hospital = new Hospital({
    user: uid,
    ...req.body,
  });

  try {
    const hospitalDB = await hospital.save();
    res.json({
      ok: true,
      hospital: hospitalDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error when you tried to create a hospital",
    });
  }
};

const updateHospitals = (req, res = response) => {
  res.json({
    ok: true,
    msg: "updateHospitals",
  });
};
const deleteHospitals = (req, res = response) => {
  res.json({
    ok: true,
    msg: "deleteHospitals",
  });
};

module.exports = {
  getHospitals,
  createHospitals,
  updateHospitals,
  deleteHospitals,
};
