const mongoose = require("mongoose");

const vehicleSchema = mongoose.Schema({
  vin: {
    type: String,
    required: true,
  },
  licensePlate: {
    type: String,
    required: true,
  },
  driver: {
    type: String,
    required: true,
  },
  mmy: {
    type: String,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  office: {
    type: String,
    required: true,
  },
  status: {
    ignition: {
      type: Boolean,
      required: true,
      default: false,
    },
    speed: {
      type: Number,
      required: true,
    },
    location: {
      lat: {
        type: Number,
        required: true,
      },
      long: {
        type: Number,
        required: true,
      },
    },
  },
});

module.exports = mongoose.model("Vehicle", vehicleSchema);
