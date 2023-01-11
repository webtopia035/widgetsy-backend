const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const templateRoute = require("../routes/template-route");
const usersRoute = require("../routes/users-route");
const HttpError = require("../models/http-error");

const app = express();

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

mongoose
  .connect(
    "mongodb+srv://ErrorMakerzz:ErrorMakerzz@cluster0.ztye4c7.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(PORT, console.log(`Server started on port ${PORT}`));
  })
  .catch((err) => {
    console.log(err);
  });
