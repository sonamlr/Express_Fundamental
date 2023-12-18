const express = require("express");
const app = express();
const authUserRouter = require("./router/authRouter");
const connectTodb = require('./config/database');

const cookieParser = require("cookie-parser")
const cors = require('cors');
connectTodb()



//express middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}))
app.use(cors({
    origin: [process.env.CLIENT_URL],
    credentials: true
}))

app.use('/api/auth/',authUserRouter);
app.use('/',(req,res) => {
    res.status(200).json({data: 'JWTauth server'});
})
module.exports = app;