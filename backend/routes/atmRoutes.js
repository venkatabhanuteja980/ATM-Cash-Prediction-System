const express = require("express");

const {
  getAllATMs,
  getATMById,
  createATM,
  updateATM,
  deleteATM,
} = require("../controllers/atmController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Anyone logged in can view ATMs
router.get("/", protect, getAllATMs);
router.get("/:id", protect, getATMById);

// Only admins can modify ATMs
router.post("/", protect, adminOnly, createATM);
router.put("/:id", protect, adminOnly, updateATM);
router.delete("/:id", protect, adminOnly, deleteATM);

module.exports = router;