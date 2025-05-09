import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Register Route
router.post('/signup', async (req, res) => {
  try {
    const { username, password, role, specialization } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save new user
    const newUser = new User({ username, password: hashedPassword, role, specialization });
    await newUser.save();

    res.json({ message: 'User created successfully!' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    // Generate JWT Token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, username: user.username, role: user.role, id: user._id });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Check User Route
router.get('/check-user/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (user) {
      res.json({ exists: true, message: 'User found!', user });
    } else {
      res.json({ exists: false, message: 'User not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;