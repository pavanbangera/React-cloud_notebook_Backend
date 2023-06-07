const mongoose = require('mongoose');
require('dotenv').config();

const DB_API = process.env.DB_API;

const mongooseConnect = async () => {
    try {
        await mongoose.connect(DB_API);
        console.log("Connected to the database");
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
};

module.exports = mongooseConnect;
