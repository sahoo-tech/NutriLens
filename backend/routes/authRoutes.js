
const express = require("express");
const {
  register,
  login,
  logout
} = require("../controller/authController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// existing routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// 🔒 Protected dashboard route
router.get("/dashboard", authMiddleware, (req, res) => {
  res.json({
    message: "Welcome to dashboard",
    user: req.user
  });
});

module.exports = router;
