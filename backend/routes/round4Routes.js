const express = require("express");
const { createRound4, getRound4 } = require("../controllers/round4Controller");
const router = express.Router();

router.post("/", createRound4);
router.get("/", getRound4);

module.exports = router;
