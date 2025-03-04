const { signInToken } = require("../middleware/auth");
const Admin = require('../Model/admin');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
    try {
      const { name, email, mobileNo, userType, city, pincode, image, password } = req.body;
      if (!name || !email || !mobileNo || !password) {
             return res.status(400).json({ 
                status: false, 
                error: 'Name, email, mobile number, and password are required' 
              });
           }
      const hashedPassword = await bcrypt.hash(password, 10);
      // Check if user already exists
      const existingUser = await Admin.findOne({ $or: [{ email }, { mobileNo }] });
      if (existingUser) {
        return res.status(400).json({ status: false, error: 'User already exists' });
      }
  
  
      const newUser = new Admin({ name, email, mobileNo, userType, city, pincode, image, password: hashedPassword });
      await newUser.save();
  
      const token = signInToken(newUser);
      res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
      handleError(res, error);
    }
  };
  exports.login = async (req, res) => {
    try {
      const { mobileOrEmail, password } = req.body;
      const user = await Admin.findOne({ $or: [{ mobileNo: mobileOrEmail }, { email: mobileOrEmail }] }).select('+password');
  
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ status: false, error: 'Invalid credentials' });
      }
  
      const token = signInToken(user);
      res.status(200).json({ status: true, message: 'Login successful', token, data: user });
    } catch (error) {
      handleError(res, error);
    }
  };

  exports.createAdmin = async (req, res) => {
    try {
      const { name, email, mobileNo, userType, state, city, role, pincode, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      // Check if admin already exists
      const existingAdmin = await Admin.findOne({ $or: [{ email }, { mobileNo }] });
      if (existingAdmin) {
        return res.status(400).json({ status: false, error: 'Admin already exists' });
      }
  
      const newUser = new Admin({ name, email, mobileNo, userType, state, city,  role, pincode, password: hashedPassword });
      await newUser.save();
  
      res.status(201).json({ status: true, data: newUser });
    } catch (error) {
      handleError(res, error);
    }
  };

  exports.changePassword = async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
      if (!oldPassword || !newPassword) return res.status(400).json({ error: 'Please provide both old and new passwords' });
  
      const user = await Admin.findById(req.user._id).select('+password');
      if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
        return res.status(400).json({ error: 'Invalid old password' });
      }
  
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
  
      res.status(200).json({ status: true, message: 'Password changed successfully' });
    } catch (error) {
      handleError(res, error);
    }
  };
  
exports.logOut = async (req, res) => {
  try {
      if (req.user) {
          let user;
          if (req.user.userType === 'Admin') {
              user = await Admin.findById(req.user._id);

              if (user) {
                  user.tokenVersion += 1;
                  await user.save();
                  res.json({ status: true, message: 'Logged out' });
              } else {
                  res.status(401).json({ status: false, message: 'Invalid user' });
              }

          } else {
              user = await Admin.findById(req.user._id);

              if (user) {
                  user.tokenVersion += 1;
                  await user.save();
                  res.json({ status: true, message: 'Logged out' });
              } else {
                  res.status(401).json({ status: false, message: 'Invalid user' });
              }
          }

      } else {
          res.status(401).json({ status: false, message: 'No token provided' });
      }

  } catch (error) {
      res.status(500).send()
  }
};


exports.updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if new email or mobile number already exists for another admin
    const { email, mobileNo } = req.body;
    if (email || mobileNo) {
      const existingUser = await Admin.findOne({
        _id: { $ne: id }, // Exclude the current admin's ID
        $or: [{ email }, { mobileNo }],
      });

      if (existingUser) {
        return res.status(400).json({ status: false, error: 'Email or mobile number already exists' });
      }
    }

    // Hash password if provided
    if (req.body.password) req.body.password = await bcrypt.hash(req.body.password, 10);


    // Update the admin data
    const updatedUser = await Admin.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ status: true,message: 'Data updatedAdmin' , data: updatedUser });
  } catch (error) {
    handleError(res, error);
  }
};

// exports.forgetpassword=async(req,res)=>
// {
//   const email=req.params.id;
//   const forgetpassword=await Admin.findOne(email);
//   try
//   {
//     if(!email)
//       {
//         return res.status(404).json({message:'email not found'});
//       }
    
//     res.status(200).json({ message: 'Password reset instructions sent.' });
//   }catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error.' });
// }
 
// }