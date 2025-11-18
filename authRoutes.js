const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/signup", async (req, res, next) => {
  try {
    const { email, password, role, teacherId } = req.body;

    if (role === "student" && !teacherId)
      return res.json({ success: false, message: "teacherId required" });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({ email, passwordHash, role, teacherId });

    res.json({ success: true, user });
  } catch (err) { next(err); }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.json({ success: false, message: "User not found" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match)
      return res.json({ success: false, message: "Incorrect password" });

    const token = jwt.sign({ id: user._id }, "SECRET123");

    res.json({ success: true, token, user });
  } catch (err) { next(err); }
});
router.get("/teachers", async (req, res) => {
  const teachers = await User.find({ role: "teacher" }).select("_id email");
  res.json({ success: true, teachers });
});

module.exports = router;
