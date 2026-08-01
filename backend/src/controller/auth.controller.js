const jwt = require("jsonwebtoken");
const Admin = require("../modules/admin/admin.model");
const { generateAccessToken } = require("../utils/generateToken");

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token missing" });
  }

  const admin = await Admin.findOne({ refreshToken });
  if (!admin) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }

  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token expired" });
    }

    const accessToken = generateAccessToken({
      id: admin._id,
      role: admin.role,
    });

    res.json({ accessToken });
  });
};
