/*
    path: api/all/:Search
*/

const { Router } = require("express");
const router = Router();
const {
  getAll,
  getDocumentsCollection,
} = require("../controllers/search.controller");
const { validateJWT } = require("../middlewares/validate-jwt");

router.get("/:search", validateJWT, getAll);
router.get("/collection/:table/:search", validateJWT, getDocumentsCollection);

module.exports = router;
