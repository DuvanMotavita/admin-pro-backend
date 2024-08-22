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

const updateMedics = async (req, res = response) => {
  const id = req.params.id;
  const uid = req.uid;
  try {
    const hospitalDb = await Medic.findById(id);

    if (!hospitalDb) {
      return res.status(404).json({
        ok: false,
        msg: "Medic not found by Id",
      });
    }

    const medicChanges = {
      ...req.body,
      user: uid,
    };

    const updatedMedic = await Medic.findByIdAndUpdate(id, medicChanges, {
      new: true,
    });

    res.json({
      ok: true,
      hospital: updatedMedic,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Issue trying to update Medic",
    });
  }
};

const deleteMedics = async (req, res = response) => {
  const id = req.params.id;
  try {
    const medicDB = await Medic.findById(id);

    if (!medicDB) {
      return res.status(404).json({
        ok: false,
        msg: "Medic not found by Id",
      });
    }

    await Medic.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: "The medic has been deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Issue trying to delete medic",
    });
  }
};

module.exports = {
  getMedics,
  createMedics,
  updateMedics,
  deleteMedics,
};
