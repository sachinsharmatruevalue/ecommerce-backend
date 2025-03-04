
const { messaging } = require("firebase-admin");
const User = require("../Model/user");
const { signInToken,tokenForVerify } = require("../middleware/auth");

const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");


// Helper function for error handling
const handleError = (res, error, status = 500) => {
  console.error(error);
  res.status(status).json({ status: false, error: error.message });
};

// Register a new admin
exports.register = async (req, res) => {
  try {
    const { name, email, mobileNo, city, pincode, password } = req.body;

    // Validate required fields
    if (!name || !email || !mobileNo || !password || !city || !pincode) {
      return res.status(400).json({
        status: false,
        message: "Name, email, mobile number, city, pincode, and password are required.",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { mobileNo }] });
    if (existingUser) {
      return res.status(400).json({ status: false, message: "User already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP and Token
    const otpCode = generateOTP();
    const token = tokenForVerify({ name, email, mobileNo, city, pincode, password: hashedPassword, otp: otpCode });

    // Send OTP via email (optional)
    // await sendOTP(email, otpCode);

    return res.status(201).json({
      status: true,
      message: "OTP sent to email. Please verify to complete registration.",
      data: { token, otpCode }, // Hide `otpCode` in production
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ status: false, message: "Internal Server Error", error: error.message });
  }
};


exports.verifyOTPForSignUp = async (req, res) => {
  try {
      const { tokenOfUser, otp } = req.body;

      if (!tokenOfUser) {
          return res.status(400).json({ error: 'Token must be provided.' });
      }

      let decoded;
      try {
          // Decode the token to get the user details
          decoded = jwt.verify(tokenOfUser, process.env.JWT_SECRET_FOR_VERIFY);
      } catch (err) {
          return res.status(401).json({ error: 'Invalid token.' });
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
          return res.status(400).json({ error: 'Invalid OTP.' });
      }

      // const Model = decoded.userType === 'Vendor' ? Vendor : User;

      
      const user = await User.create(decoded);

      if (!user || !user._id) {
          return res.status(500).json({ error: 'User creation failed.' });
      }

      
      const token = signInToken(user);

      res.status(200).json({
          status: true,
          message: 'OTP verified successfully',
          token,
          user
      });
  } catch (error) {
      console.error('Error during OTP verification:', error);
      res.status(500).json({ error: 'Internal Server Error.', message: error.message });
  }
};
// Login User


exports.login = async (req, res) => {
  try {
    console.log(req.body);
    const {email, password } = req.body;
    const user = await  User.findOne({ $or: [{ email: email }] }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ status: false, error: 'Invalid credentials' });
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
     return res.status(200).json({ status: true, message: 'Login successful', token, data: user });
    
   res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};


exports.updatedata = async (req, res) => {
  const { id } = req.params; 
  const { name, email, password,address,city,state,pincode,mobileNo} = req.body;  

  try {
      // Find user by ID and update their details
      const updatedUser = await User.findByIdAndUpdate(id, { name, email, password,address,city,state,pincode ,mobileNo}, { new: true });
      
      if (!updatedUser) {
          return res.status(404).json({ message: 'User not found' });
      }

     res.status(200).json(updatedUser);  // Return the updated user
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating user' });
  }
};
function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000);
}










