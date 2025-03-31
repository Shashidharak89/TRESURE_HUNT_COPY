const express = require("express");
const { createRound2, getRound2 } = require("../controllers/round2Controller");
const router = express.Router();

router.post("/", createRound2);
router.get("/", getRound2);

module.exports = router;
