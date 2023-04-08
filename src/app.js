require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const templateRoute = require("../routes/templateRoutes");
const usersRoute = require("../routes/userRoutes");
const HttpError = require("../errors/HttpError");
const BadRequest = require("../errors/BadRequest");

const app = express();

const connectDB = require("../db/connect");

app.use(cors());

app.use(bodyParser.json());

app.use("/api/widget", templateRoute);
app.use("/api/user", usersRoute);

app.use((req, res, next) => {
  const error = new HttpError("could not find this route", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred" });
});

const PORT = process.env.PORT || 8000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () =>
      console.log(`Server is listening on port: ${PORT}...`)
    );
  } catch (error) {
    throw new BadRequest("Cannot Connect to db");
  }
};
start();
