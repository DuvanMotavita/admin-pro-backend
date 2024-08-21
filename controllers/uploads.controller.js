const path = require("path");
const { response } = require("express");
const { v4: uuidv4 } = require("uuid");
const { updateImage } = require("../helpers/updated-image");
const fs = require("fs");
const fileUpload = async (req, res = response) => {
  const type = req.params.type;
  const id = req.params.id;

  // Validating types
  const validTypes = ["hospitals", "medics", "users"];
  if (!validTypes.includes(type)) {
    return res.status(400).json({
      ok: false,
      msg: "This is not  a medic, user or hospital",
    });
  }
  //Validating that the file exists
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      msg: "No files were uploaded.",
    });
  }

  //Processing file
  const file = req.files.image;
  const cropName = file.name.split(".");
  const extension = cropName[cropName.length - 1];

  //Validate extension

  const validExtensions = ["png", "jpg", "jpeg", "gif"];
  if (!validExtensions.includes(extension)) {
    return res.status(400).json({
      ok: false,
      msg: "File extension is not valid.",
    });
  }

  //Generating file name
  const fileName = `${uuidv4()}.${extension}`;
  //Path to save image
  const path = `./uploads/${type}/${fileName}`;

  // Use the mv() method to place the file somewhere on your server
  file.mv(path, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        ok: false,
        msg: "Error moving image.",
      });
    }

    //Updated database
    updateImage(type, id, fileName);
    res.json({
      ok: true,
      msg: "File uploaded correctly",
      fileName,
    });
  });
};

const returnImage = (req, res = response) => {
  const type = req.params.type;
  const img = req.params.img;
  const pathImg = path.join(__dirname, `../uploads/${type}/${img}`);
  //Default image
  if (fs.existsSync(pathImg)) {
    res.sendFile(pathImg);
  } else {
    const pathImg = path.join(__dirname, `../uploads/no-img.jpg`);
    res.sendFile(pathImg);
  }
};

module.exports = {
  fileUpload,
  returnImage,
};
