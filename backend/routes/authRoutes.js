// const express = require("express");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// const router = express.Router();

// // Register Route
// router.post("/signup", async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     // Check if user exists
//     const existingUser = await User.findOne({ username });
//     if (existingUser) return res.status(400).json({ msg: "User already exists" });

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Save new user
//     const newUser = new User({ username, password: hashedPassword });
//     await newUser.save();

//     res.json({ msg: "User registered successfully" });
//   } catch (err) {
//     res.status(500).json({ msg: "Server error" });
//   }
// });

// // Login Route
// router.post("/login", async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     // Find user
//     const user = await User.findOne({ username });
//     if (!user) return res.status(400).json({ msg: "Invalid credentials" });

//     // Compare passwords
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

//     // Generate JWT Token
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

//     res.json({ token, username: user.username });
//   } catch (err) {
//     res.status(500).json({ msg: "Server error" });
//   }
// });

// module.exports = router;
