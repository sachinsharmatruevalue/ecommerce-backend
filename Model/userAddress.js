const mongoose = require("mongoose");

// Define the address schema
const addressSchema = new mongoose.Schema({
  street: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // Link the product to a subcategory (a category with a parentCategory set)
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  landmark: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});

// Create the Address model
const UserAddress = mongoose.model("Address", addressSchema);

module.exports = UserAddress;
