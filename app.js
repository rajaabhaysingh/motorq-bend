const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const env = require("dotenv");

const app = express();
env.config();

const vehicleRoutes = require("./api/routes/vehicles");

// using body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// handling CORS
app.use(cors());

app.use("/vehicles", vehicleRoutes);

// db
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.agqs7.mongodb.net/${process.env.MONGO_DBNAME}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((res) => {
    console.log("Database connected. You can start working now...");
  })
  .catch((err) => {
    console.log("Error: Couldn't connect to database.", err);
  });

// error handling
app.use((req, res, next) => {
  const err = new Error("Not found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: err.message ?? "Internal server error.",
  });
});

module.exports = app;
