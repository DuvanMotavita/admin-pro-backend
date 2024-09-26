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
  getMedicsById,
} = require("../controllers/medics.controller");

router.get("/", validateJWT, getMedics);
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
router.put(
  "/:id",
  [
    validateJWT,
    check("name", "Medic name is required").not().isEmpty(),
    check("hospital", "Hospital Id should be valid").isMongoId(),
    validateFields,
  ],
  updateMedics
);
router.delete("/:id", validateJWT, deleteMedics);
router.get("/:id", validateJWT, getMedicsById);

module.exports = router;
