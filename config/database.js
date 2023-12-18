const mongoose = require("mongoose");
// const MONGO_URL = "mongodb://localhost:27017/my_database";
//snm6268

const MONGO_URL = process.env.MONGO_URI;
const databaseconnect = () => {
    mongoose.connect(MONGO_URL)
    .then((conn) => console.log(`Connected to DB: ${conn.connection.host}`))
    .catch((err) => console.log(err.message));
}

module.exports = databaseconnect;