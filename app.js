const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path = require("path");
const cookieParser = require("cookie-parser");

//setting up config file
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

// handeling errors
const errorMiddleware = require("./middleWares/errors");

// import all routes here
const userRoutes = require("./routes/userRoutes");
const buddyRoutes = require("./routes/buddyRoutes");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());
app.use(errorMiddleware);


app.use('/api/v1/user', userRoutes);
app.use('/api/v1/buddy', buddyRoutes);

// TODO cors setup
const cors = require("cors");
// const allowedOrigins = [];
// app.use(
//   cors({
//     origin: allowedOrigins,
//     credentials: true,
//   })
// );

// middleware to handle errors

module.exports = app;
