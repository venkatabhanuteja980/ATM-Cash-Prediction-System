const mongoose = require("mongoose");

const atmSchema = new mongoose.Schema(
  {
    atmId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    atmName: {
      type: String,
      required: true,
      trim: true,
    },

    bankName: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "maintenance"],
      default: "active",
    },

    cashLevel: {
      type: String,
      enum: ["low", "medium", "high", "unknown"],
      default: "unknown",
    },

    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ATM", atmSchema);