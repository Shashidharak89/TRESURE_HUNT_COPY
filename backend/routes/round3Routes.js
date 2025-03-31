const express = require("express");
const { createRound3, getRound3 } = require("../controllers/round3Controller");
const router = express.Router();

router.post("/", createRound3);
router.get("/", getRound3);

module.exports = router;
