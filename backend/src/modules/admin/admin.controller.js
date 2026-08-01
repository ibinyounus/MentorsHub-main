const Admin = require("./admin.model");
const { comparePassword } = require("../../utils/hashPassword");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/generateToken");

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await comparePassword(password, admin.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const payload = { id: admin._id, role: admin.role };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  admin.refreshToken = refreshToken;
  await admin.save();

  res.status(200).json({
    message: "Login successful",
    accessToken,
    refreshToken,
  });
};

exports.adminLogout = async (req, res) => {
  // In a real app, you might want to blacklist the token or remove the refresh token from the DB
  // For now, we can just respond successfully, or if we had the user ID in the request (protected), remove refreshToken.
  // Assuming this route might be protected or we rely on client clearing.
  // Let's try to remove refresh token if user is authenticated.

  if (req.user && req.user.id) {
    await Admin.findByIdAndUpdate(req.user.id, { refreshToken: "" });
  }

  res.status(200).json({ message: "Logout successful" });
};
