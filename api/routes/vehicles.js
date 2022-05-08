const express = require("express");
const mongoose = require("mongoose");

const Vehicle = require("../models/vehicles");

const router = express.Router();

// get all vehicles
router.get("/", (req, res, next) => {
  const limit =
    req.query.count && parseInt(req.query.count, 10) <= 500
      ? parseInt(req.query.count, 10)
      : 500;
  const page = parseInt(req.query.page, 10) || 1;

  const vin = req.query.vin || "";
  const driver = req.query.driver || "";
  const licensePlate = req.query.licensePlate || "";

  Vehicle.find({
    vin: RegExp(vin),
    driver: RegExp(driver),
    licensePlate: RegExp(licensePlate),
  })
    .skip((page - 1) * limit)
    .limit(limit)
    .exec()
    .then((vehicles) => {
      res.status(200).json({
        message: "success",
        data: vehicles,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "error",
        error: err,
      });
    });
});

// get vehicle by _id - not used currently
router.get("/:id", (req, res, next) => {
  Vehicle.findById(req.params.id)
    .exec()
    .then((vehicleFound) => {
      res.status(200).json({
        message: "success",
        data: vehicleFound,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "error",
        error: err,
      });
    });
});

router.post("/", (req, res, next) => {
  const vehicle = new Vehicle({
    vin: req.body.vin,
    licensePlate: req.body.licensePlate,
    driver: req.body.driver,
    mmy: req.body.mmy,
    customerName: req.body.customerName,
    office: req.body.office,
    status: {
      ignition: req.body.ignition,
      speed: req.body.speed,
      location: {
        lat: req.body.lat,
        long: req.body.long,
      },
    },
  });

  vehicle
    .save()
    .then((savedVehicle) => {
      res.status(201).json({
        message: "success",
        data: savedVehicle,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "error",
        error: err,
      });
    });
});

// patch vehicle
router.patch("/:id", (req, res, next) => {
  Vehicle.findById(req.params.id)
    .exec()
    .then((vehicle) => {
      if (vehicle) {
        const { customerName, driver, office, licensePlate } = req.body;

        return Vehicle.findByIdAndUpdate(req.params.id, {
          customerName,
          driver,
          office,
          licensePlate,
        });
      } else {
        return res.status(404).json({
          message: "The vehicle you want to edit doesn't exist.",
          error: { message: "Not found. (404)" },
        });
      }
    })
    .then((updatedVehicle) => {
      res.status(200).json({
        message: "success",
        data: updatedVehicle,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "error",
        error: err,
      });
    });
});

// endpoint to populate dummy data
router.post("/populateDummy", (req, res, next) => {
  const dummyData = [];

  const capsNum = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const caps = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const small = "abcdefghijklmnopqrstuvwxyz";
  const nums = "0123456789";

  const generateRandomString = (characters = capsNum, length = 6) => {
    let result = "";
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  for (let i = 0; i < 500; i++) {
    const temp = new Vehicle({
      vin: generateRandomString(),
      licensePlate:
        generateRandomString(caps, 2) +
        generateRandomString(nums, 2) +
        generateRandomString(caps, 1) +
        generateRandomString(nums, 4),
      driver:
        generateRandomString(caps, 1) +
        generateRandomString(small, Math.floor(Math.random() * 5 + 3)) +
        " " +
        generateRandomString(caps, 1) +
        generateRandomString(small, Math.floor(Math.random() * 5 + 3)),
      mmy:
        Math.floor(Math.random() * 123 + 1900) +
        ", " +
        generateRandomString(caps, Math.floor(Math.random() * 5 + 3)) +
        ", " +
        generateRandomString(caps, 1) +
        generateRandomString(small, Math.floor(Math.random() * 5 + 3)),
      customerName:
        generateRandomString(caps, 1) +
        generateRandomString(small, Math.floor(Math.random() * 5 + 3)) +
        " " +
        generateRandomString(caps, 1) +
        generateRandomString(small, Math.floor(Math.random() * 5 + 3)),
      office:
        generateRandomString(capsNum, Math.floor(Math.random() * 5 + 3)) +
        ", " +
        generateRandomString(caps, 1) +
        generateRandomString(small, Math.floor(Math.random() * 5 + 3)),
      status: {
        ignition: Math.random() < 0.5,
        speed: Math.floor(Math.random() * 200 + 20),
        location: {
          lat: (Math.random() * (30.0 - 16.0) + 16.0).toFixed(4),
          long: (Math.random() * (80.0 - 72.0) + 72.0).toFixed(4),
        },
      },
    });

    dummyData.push(temp);
  }

  Vehicle.insertMany(dummyData)
    .then((inserted) => {
      res.status(200).json({
        message: "success",
        data: inserted,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "error",
        error: err,
      });
    });
});

module.exports = router;
