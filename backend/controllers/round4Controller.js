const Round4 = require("../models/round4Model");

const createRound4 = async (req, res) => {
    try {
        const { team, participant1, participant2, endTime } = req.body;
        const newRound = new Round4({ team, participant1, participant2, endTime });
        await newRound.save();
        res.status(201).json({ message: "Round 4 data added", newRound });
    } catch (error) {
        res.status(500).json({ message: "Error adding round 4 data", error });
    }
};

const getRound4 = async (req, res) => {
    try {
        const rounds = await Round4.find();
        res.status(200).json(rounds);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving round 3 data", error });
    }
};

module.exports = { createRound4, getRound4 };
