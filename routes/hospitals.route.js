/*
    Hospitals:
    ruta: '/api/hospitals'
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validate-fields");

const { validateJWT } = require("../middlewares/validate-jwt");
const router = Router();

const {
  getHospitals,
  createHospitals,
  updateHospitals,
  deleteHospitals,
} = require("../controllers/hospitals.controller");

router.get("/", getHospitals);
router.post(
  "/",
  [
    validateJWT,
    check("name", "Hospital name is required").not().isEmpty(),
    validateFields,
  ],
  createHospitals
);
router.put(
  "/:id",
  [
    validateJWT,
    check("name", "Hospital name is required").not().isEmpty(),
    validateFields,
  ],
  updateHospitals
);
router.delete("/:id", validateJWT, deleteHospitals);

module.exports = router;
