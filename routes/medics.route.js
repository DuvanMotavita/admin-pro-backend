/*

    Medics
    ruta: 'api/medic'

*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validate-fields");

const { validateJWT } = require("../middlewares/validate-jwt");
const router = Router();

const {
  getMedics,
  createMedics,
  updateMedics,
  deleteMedics,
} = require("../controllers/medics.controller");

router.get("/", getMedics);
router.post(
  "/",
  [
    validateJWT,
    check("name", "Medic name is required").not().isEmpty(),
    check("hospital", "Hospital Id should be valid").isMongoId(),
    validateFields,
  ],
  createMedics
);
router.put("/:id", [], updateMedics);
router.delete("/:id", deleteMedics);

module.exports = router;
