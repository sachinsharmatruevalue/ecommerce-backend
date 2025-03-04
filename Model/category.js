const mongoose = require('mongoose');

// Category Schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,  // Ensure each category has a unique name
      trim: true,    // Remove leading and trailing spaces
      required:[true,'plese provide '],
    },
    image: {
      type: String,  // URL of the category image
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
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
