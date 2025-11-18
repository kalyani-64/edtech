const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token)
    return res.status(401).json({ success: false, message: "No token provided" });

  try {
    const decoded = jwt.verify(token, "SECRET123");
    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};
