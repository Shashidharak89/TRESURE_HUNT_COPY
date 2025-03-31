const Round3 = require("../models/round3Model");

const createRound3 = async (req, res) => {
    try {
        const { team, participant1, participant2, endTime } = req.body;
        const newRound = new Round3({ team, participant1, participant2, endTime });
        await newRound.save();
        res.status(201).json({ message: "Round 3 data added", newRound });
    } catch (error) {
        res.status(500).json({ message: "Error adding round 3 data", error });
    }
};

const getRound3 = async (req, res) => {
    try {
        const rounds = await Round3.find();
        res.status(200).json(rounds);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving round 3 data", error });
    }
};

module.exports = { createRound3, getRound3 };
