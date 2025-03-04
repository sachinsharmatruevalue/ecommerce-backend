const mongoose = require('mongoose');

// Brand Schema
const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,  // Ensure each Brand has a unique name
      required:[true,'plese provide '],
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'], // Only two valid states for the category
      default: 'Active',
    },
  },
  { timestamps: true }
);

// Create Category model
const Brand = mongoose.model('Brand', BrandSchema);

module.exports = Brand;
