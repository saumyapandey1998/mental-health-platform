// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const authRoutes = require("./routes/authRoutes");

// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cors());

// const userSchema = new mongoose.Schema({
//     username: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//   });
  
//   // Ensure that this model is using the 'users' collection inside 'authdb'
//   const User = mongoose.model("User", userSchema, "users");
  
//   export default User;

// // Routes
// // Connect to MongoDB (authdb)
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log("✅ MongoDB Connected to authdb"))
// .catch(err => console.error("❌ MongoDB Connection Error:", err));

// // API Route to Add a User
// // app.post("/signup", async (req, res) => {
// //   const { username, password } = req.body;
// //   try {
// //     const newUser = new User({ username, password });
// //     await newUser.save();
// //     res.json({ message: "User created successfully!" });
// //   } catch (error) {
// //     res.status(400).json({ error: "User creation failed" });
// //   }
// // });

// // Connect to MongoDB (authdb)
// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("✅ MongoDB Connected to authdb"))
//   .catch(err => console.error("❌ MongoDB Connection Error:", err));
  
//   // API Route to Add a User
//   app.post("/signup", async (req, res) => {
//     const { username, password } = req.body;
//     try {
//       const newUser = new User({ username, password });
//       await newUser.save();
//       res.json({ message: "User created successfully!" });
//     } catch (error) {
//       res.status(400).json({ error: "User creation failed" });
//     }
//   });
  




// const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB (authdb)
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected to authdb"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Define User Schema & Model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema, "users");

// API Route to Add a User
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    const newUser = new User({ username, password });
    await newUser.save();
    res.json({ message: "User created successfully!" });
  } catch (error) {
    res.status(400).json({ error: "User creation failed" });
  }
});

// Route to check if a user exists
app.get("/check-user/:username", async (req, res) => {
    try {
      const user = await User.findOne({ username: req.params.username });
      if (user) {
        res.json({ exists: true, message: "User found!", user });
      } else {
        res.json({ exists: false, message: "User not found." });
      }
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  app.post("/login", async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Find user by username
      console.log('in login')
      const user = await User.findOne({ username });
      console.log('in login')
      console.log(user)
      if (!user) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }
  
      // Compare password with hashed password stored in database
    //   const isMatch = await bcrypt.compare(password, user.password);
      const isMatch = password === user.password;
      console.log(isMatch)
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }
  
      // Generate JWT token
      console.log('in login')
      console.log("JWT Secret:", process.env.JWT_SECRET);
    //   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    //   console.log(token)
      console.log('in login')
      // Send token back
      res.json({username: user.username });
    } catch (error) {
      res.status(500).json({ msg: "Server error" });
    }
  });

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

