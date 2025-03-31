const express = require("express");
const { createRound1, getRound1 } = require("../controllers/round1Controller");
const router = express.Router();

router.post("/", createRound1);
router.get("/", getRound1);

module.exports = router;
