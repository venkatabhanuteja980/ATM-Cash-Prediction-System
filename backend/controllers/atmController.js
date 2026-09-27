const ATM = require("../models/ATM");

// Get all ATMs
const getAllATMs = async (req, res) => {
  try {
    const atms = await ATM.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: atms.length,
      atms,
    });
  } catch (error) {
    console.error("Get ATMs error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch ATMs",
    });
  }
};

// Get single ATM
const getATMById = async (req, res) => {
  try {
    const atm = await ATM.findById(req.params.id);

    if (!atm) {
      return res.status(404).json({
        success: false,
        message: "ATM not found",
      });
    }

    res.status(200).json({
      success: true,
      atm,
    });
  } catch (error) {
    console.error("Get ATM error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch ATM",
    });
  }
};

// Add new ATM
const createATM = async (req, res) => {
  try {
    const {
      atmId,
      atmName,
      bankName,
      address,
      latitude,
      longitude,
      status,
      cashLevel,
    } = req.body;

    const existingATM = await ATM.findOne({ atmId });

    if (existingATM) {
      return res.status(400).json({
        success: false,
        message: "ATM ID already exists",
      });
    }

    const atm = await ATM.create({
      atmId,
      atmName,
      bankName,
      address,
      latitude,
      longitude,
      status,
      cashLevel,
    });

    res.status(201).json({
      success: true,
      message: "ATM created successfully",
      atm,
    });
  } catch (error) {
    console.error("Create ATM error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create ATM",
    });
  }
};

// Update ATM
const updateATM = async (req, res) => {
  try {
    const atm = await ATM.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!atm) {
      return res.status(404).json({
        success: false,
        message: "ATM not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "ATM updated successfully",
      atm,
    });
  } catch (error) {
    console.error("Update ATM error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update ATM",
    });
  }
};

// Delete ATM
const deleteATM = async (req, res) => {
  try {
    const atm = await ATM.findByIdAndDelete(req.params.id);

    if (!atm) {
      return res.status(404).json({
        success: false,
        message: "ATM not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "ATM deleted successfully",
    });
  } catch (error) {
    console.error("Delete ATM error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete ATM",
    });
  }
};

module.exports = {
  getAllATMs,
  getATMById,
  createATM,
  updateATM,
  deleteATM,
};