
const User = require("../Model/user");
const { signInToken, tokenForVerify } = require("../Middleware/auth");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



// Register a new admin
exports.register = async (req, res) => {
  try {
    const { name, email, mobileNo, address, city, state, pincode, password } = req.body;

    // Validate required fields
    if (!name || !email || !mobileNo || !password || !address || !city || !state || !pincode) {
      return res.status(400).json({
        status: false,
        message: "Name, email, mobile number, address, city, state, pincode, and password are required.",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { mobileNo }] });
    if (existingUser) {
      return res.status(400).json({ status: false, message: "User already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const otpCode = generateOTP();

    // Store user data in a temp collection (or Redis) for OTP verification
    const tempUser = {
      name,
      email,
      mobileNo,
      address,  
      city,     
      state,  
      pincode,   
      password: hashedPassword,
      otp: otpCode,
    };

    const token = tokenForVerify(tempUser);

    return res.status(201).json({
      status: true,
      message: "OTP sent to email. Please verify to complete registration.",
      data: { token, otpCode }, // Hide `otpCode` in production
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


exports.verifyOTPForSignUp = async (req, res) => {
  try {
    const { tokenOfUser, otp } = req.body;

    if (!tokenOfUser) {
      return res.status(400).json({ error: "Token must be provided." });
    }

    let decoded;
    try {
      // Decode the token to get the user details
      decoded = jwt.verify(tokenOfUser, process.env.JWT_SECRET_FOR_VERIFY);
    } catch (err) {
      return res.status(401).json({ error: "Invalid token." });
    }

    // Add additional fields to decoded user data
    // decoded.fcmToken = fcmToken;
    // decoded.imei = imei;
    // decoded.deviceType = deviceType;
    // decoded.deviceName = deviceName;
    // decoded.deviceIp = deviceIp;
    // decoded.loginType = loginType;

    // Check if the OTP matches
    if (decoded.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP." });
    }

    // const Model = decoded.userType === 'Vendor' ? Vendor : User;

    const user = await User.create(decoded);

    if (!user || !user._id) {
      return res.status(500).json({ error: "User creation failed." });
    }

    const token = signInToken(user);

    res.status(200).json({
      status: true,
      message: "OTP verified successfully",
      token,
      user,
    });
  } catch (error) {
    console.error("Error during OTP verification:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error.", message: error.message });
  }
};
// Login User

exports.login = async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    const user = await User.findOne({ $or: [{ email: email }] }).select(
      "+password"
    );

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(400)
        .json({ status: false, error: "Invalid credentials" });
    }

    // try {
    //   const { email, password } = req.body;
    //   const user = await User.findOne({ email });
    //   if (!user) {
    //     return res.status(400).json({ msg: "Invalid credentials" });
    //   }

    //   const isMatch = !await bcrypt.compare(password, user.password)
    //   if (!isMatch) {
    //     return res.status(400).json({ msg: "Invalid credentials" });
    //   }

    // Generate JWT token
    const token = signInToken(user);
    return res
      .status(200)
      .json({ status: true, message: "Login successful", token, data: user });

    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.updatedata = async (req, res) => {
  const { id } = req.params;
  const { name, email, mobileNo, password, address, city, state, pincode } = req.body;

  try {
    // Find the user by ID
    let user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create an update object
    const updatedFields = { name, email, mobileNo, address, city, state, pincode };

    // Hash password only if it's provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatedFields.password = await bcrypt.hash(password, salt);
    }

    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(id, updatedFields, { new: true });

    res.status(200).json({
      status: true,
      message: "User updated successfully",
      data: updatedUser,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Error updating user", error: error.message });
  }
};
function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000);
}

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ status: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.GetUser=async(req,res)=>
{
  try {
    const users = await User.find().sort({ created: -1 });; // Fetch all users from DB
    res.status(200).json({ success: true, users });
} catch (error) {
    res.status(500).json({ success: false, message: error.message });
}
}
exports.deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};