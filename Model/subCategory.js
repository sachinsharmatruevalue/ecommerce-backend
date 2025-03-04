const mongoose = require('mongoose');

// Category Schema
const subcategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true, // Remove leading and trailing spaces
      required:[true,'plese provide '],
    },
    description: {
      type: String,
      trim: true, // Remove extra spaces
    },
    Category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'category', // Reference to another category for parent-child relationship
      required:[true,'plese provide '],
    },
    Categoryname: {
      type: String,
      required:[true,'plese provide '],
    },
    image: {
      type: String,  // URL of the category image (optional)
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },

  },
  { timestamps: true }
);

// Create Category model
const subCategory = mongoose.model('subCategory', subcategorySchema);

module.exports = subCategory;
