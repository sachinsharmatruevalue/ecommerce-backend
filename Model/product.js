const mongoose = require("mongoose");

// Product Schema

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Remove leading and trailing spaces
    },
    description: {
      type: String,
      trim: true, // Remove extra spaces
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    offerprice: {
      type: Number,
      required: true,
      min: 0,
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "brand", // Link the product to a subcategory (a category with a parentCategory set)
        required: true,
      },
    brandName: {
      type: String,
      require: true,
    },
    subCategory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subCategory", // Link the product to a subcategory (a category with a parentCategory set
        required: true,
      },
    ],
    subCategoryname: [
      {
        type: String,
        required: true,
      },
    ],
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "category",
      },
    ],
    categoryname: [
      {
        type: String,
        required: true,
      },
    ],

    images: [
      {
        type: String, // URL to the product image
        required: true,
      },
    ],

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

// Create Product model
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
