const Round1 = require("../models/round1Model");

const createRound1 = async (req, res) => {
    try {
        const { team, participant1, participant2, endTime } = req.body;
        const newRound = new Round1({ team, participant1, participant2, endTime });
        await newRound.save();
        res.status(201).json({ message: "Round 1 data added", newRound });
    } catch (error) {
        res.status(500).json({ message: "Error adding round 1 data", error });
    }
};

const getRound1 = async (req, res) => {
    try {
        const rounds = await Round1.find();
        res.status(200).json(rounds);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving round 1 data", error });
    }
};

module.exports = { createRound1, getRound1 };
