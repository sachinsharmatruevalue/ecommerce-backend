const UserAddress = require("../Model/userAddress");
const User=require("../Model/user");
exports.CreateUserAddress = async (req, res) => {
  try {
    console.log("Received Data:", req.body);  // ✅ Debugging log

     // Check if category ID is provided
        if (!req.body.user) {
          return res
            .status(400)
            .json({ status: false, message: "User ID is required" });
        }
          const userDoc = await User.findById(req.body.user);
        
            if (!userDoc) {
              return res
                .status(404)
                .json({ status: false, message: "User not found" });
            }
        
            // Assign category name
            req.body.username = userDoc.name;
    // Check if all required fields exist
    const { street, city, state, postalCode, country, address } = req.body;
    if (!street || !city || !state || !postalCode || !country || !address) {
      return res.status(400).json({ status: false, message: "All fields are required" });
    }
    

    // Create address
    const newAddress = await UserAddress.create(req.body);
    console.log("Saved Address:", newAddress); // ✅ Debugging log

    res.status(201).json({ status: true, message: "User Address created", data: newAddress });
  } catch (err) {
    console.error("Database Error:", err);
    res.status(400).json({ status: false, error: err.message });
  }
};

exports.GetAllAddresses = async (req, res) => {
  try {
    const addresses = await UserAddress.find().sort({ created: -1 });
    if (!addresses.length) {
      return res.status(200).json({ status: true, message: "No addresses found", data: [] });
    }
    res.status(200).json({ status: true, message: "Address list retrieved", data: addresses });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

exports.DeleteUserAddress = async (req, res) => {

  try {
    const id = req.params.id;
    const deletes = await UserAddress.findById(id);
    if (!deletes) {
      return res
        .status(404)
        .json({ status: false, message: "UserAddress Not Found" });
    }
    await UserAddress.findByIdAndDelete(deletes);
    res.status(200).json({ status: true, message: "UserAddress Deleted " });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};
exports.UpdateUserAddress = async (req, res) => {
  try {
    const id = req.params.id; // Address ID
    const address = await UserAddress.findById(id);

    if (!address) {
      return res
        .status(404)
        .json({ status: false, message: "UserAddress Not Found" });
    }

    // Update the Address Fields
    Object.keys(req.body).forEach((key) => {
      address[key] = req.body[key];
    });

    await address.save();

    res.status(200).json({
      status: true,
      message: "UserAddress Updated Successfully",
      updatedAddress: address,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, error: err.message });
  }
};


exports.GetByIdUserAddress = async (req, res) => {

  try {
    const id = req.params.id;
    const address = await UserAddress.findById(id).populate('user');
    if (address.length == 0) {
      return res
        .status(404)
        .json({ status: false, messgae: "userAddress Not Found" });
    }
    res
      .status(400)
      .json({
        status: true,
        message: "userAddress Fetch Successfully",
        data: address,
      });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};
