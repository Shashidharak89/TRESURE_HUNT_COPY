const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "treasure_hunt", // ✅ Correct way to specify DB name
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected to treasure_hunt database");
    } catch (error) {
        console.error("MongoDB connection failed", error);
        process.exit(1);
    }
};

module.exports = connectDB;
