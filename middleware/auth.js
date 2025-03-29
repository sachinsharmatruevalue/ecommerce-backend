require("dotenv").config();
const jwt = require("jsonwebtoken");
const Admin = require("../Model/admin");
const User = require("../Model/user");

/**
 * Generate JWT token for signing in
 */
const signInToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      address: user.address || "",
      phone: user.phone || "",
      image: user.image || "",
      userType: user.userType,
      tokenVersion: user.tokenVersion,
    },
    process.env.JWT_SECRET,
    { expiresIn: "60d" }
  );
};

/**
 * Generate a short-lived token for email verification
 */
const tokenForVerify = (user) => {
  return jwt.sign(
    { _id: user._id, email: user.email },
    process.env.JWT_SECRET_FOR_VERIFY,
    { expiresIn: "15m" }
  );
};

/**
 * Middleware to check if the user is authenticated
 */
const isAuth = async (req, res, next) => {
  try {
    console.log("🔍 Checking Authentication...");
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("🚨 Missing or incorrect Authorization header!");
      return res.status(401).json({ status: false, message: "Authorization header missing or invalid" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      console.log("🚨 Token missing!");
      return res.status(401).json({ status: false, message: "Token not found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded Token:", decoded);

    let user = await User.findById(decoded._id);

    if (!user) {
      console.log("🚨 User not found in the database!");
      return res.status(404).json({ status: false, message: "User not found" });
    }

    if (user.status === "Inactive") {
      console.log("🚨 User account is inactive!");
      return res.status(403).json({ status: false, message: "User account is inactive" });
    }

    if (user.tokenVersion !== decoded.tokenVersion) {
      console.log("🚨 Token version mismatch! User must log in again.");
      return res.status(401).json({ status: false, message: "Invalid token. Please login again." });
    }

    req.user = user; // Attach user object to request
    console.log("✅ User authenticated successfully!");
    next();
  } catch (err) {
    console.error("🚨 Authentication Error:", err.message);
    return res.status(401).json({ status: false, message: "Invalid or expired token", error: err.message });
  }
};

/**
 * Middleware to check if the user is an admin
 */
const isAdmin = async (req, res, next) => {
  try {
    console.log("🔍 Checking Admin Authentication...");
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("🚨 Missing or incorrect Authorization header!");
      return res.status(401).json({ status: false, message: "Authorization header missing or invalid" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      console.log("🚨 Token missing!");
      return res.status(401).json({ status: false, message: "Token not found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded Admin Token:", decoded);

    const admin = await Admin.findById(decoded._id);
    if (!admin) {
      console.log("🚨 Admin user not found in database!");
      return res.status(403).json({ status: false, message: "User is not an admin" });
    }

    req.user = admin;
    console.log("✅ Admin authenticated successfully!");
    next();
  } catch (err) {
    console.error("🚨 Admin Authentication Error:", err.message);
    return res.status(401).json({ status: false, message: "Invalid or expired token", error: err.message });
  }
};

module.exports = {
  signInToken,
  tokenForVerify,
  isAuth,
  isAdmin,
};
