/*
Route: /api/users
*/
const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validate-fields");
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/users.controller");
const {
  validateJWT,
  validateAdminRole,
  validateAdminRoleSameUser,
} = require("../middlewares/validate-jwt");
const router = Router();

router.get("/", validateJWT, getUsers);
router.post(
  "/",
  [
    // validateJWT,
    check("name", "The name is required").not().isEmpty(),
    check("password", "The password is required").not().isEmpty(),
    check("email", "The email is required").isEmail(),
    validateFields,
  ],
  createUser
);
router.put(
  "/:id",
  [
    validateJWT,
    validateAdminRoleSameUser,
    check("name", "The name is required").not().isEmpty(),
    check("email", "The email is required").isEmail(),
    check("role", "The role is required").not().isEmpty(),
    validateFields,
  ],
  updateUser
);

router.delete("/:id", [validateJWT, validateAdminRole], deleteUser);

module.exports = router;
