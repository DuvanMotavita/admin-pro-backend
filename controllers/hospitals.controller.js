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

const updateHospitals = async (req, res = response) => {
  const id = req.params.id;
  const uid = req.uid;
  try {
    const hospitalDb = await Hospital.findById(id);

    if (!hospitalDb) {
      return res.status(404).json({
        ok: false,
        msg: "Hospital not found by Id",
      });
    }

    const hospitalChanges = {
      ...req.body,
      user: uid,
    };

    const updatedHospital = await Hospital.findByIdAndUpdate(
      id,
      hospitalChanges,
      { new: true }
    );

    res.json({
      ok: true,
      hospital: updatedHospital,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Issue trying to update hospital",
    });
  }
};
const deleteHospitals = async (req, res = response) => {
  const id = req.params.id;
  try {
    const hospitalDb = await Hospital.findById(id);

    if (!hospitalDb) {
      return res.status(404).json({
        ok: false,
        msg: "Hospital not found by Id",
      });
    }

    await Hospital.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: "The hospital has been deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Issue trying to delete hospital",
    });
  }
};

module.exports = {
  getHospitals,
  createHospitals,
  updateHospitals,
  deleteHospitals,
};
