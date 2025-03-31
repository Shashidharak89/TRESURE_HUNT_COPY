const Round2 = require("../models/round2Model");

const createRound2 = async (req, res) => {
    try {
        const { team, participant1, participant2, endTime } = req.body;
        const newRound = new Round2({ team, participant1, participant2, endTime });
        await newRound.save();
        res.status(201).json({ message: "Round 2 data added", newRound });
    } catch (error) {
        res.status(500).json({ message: "Error adding round 2 data", error });
    }
};

const getRound2 = async (req, res) => {
    try {
        const rounds = await Round2.find();
        res.status(200).json(rounds);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving round 2 data", error });
    }
};

module.exports = { createRound2, getRound2 };
