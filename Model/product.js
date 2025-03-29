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
    productkey: [
      {
        Size: {
          type: String,
         
        },
        Quantity: {
          type: Number,
          required: true,
          min: 0,
        },
       
        OfferPrice: {
          type: Number,
          min: 0,
        },
      },
    ],
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    brand: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "brand",
      },
    ],
    brandname: [
      {
        type: String,
      },
    ],
    subCategory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "subCategory",
      },
    ],
    subCategoryname: [
      {
        type: String,
      },
    ],
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Category",
      },
    ],
    categoryname: [
      {
        type: String,
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
const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

module.exports = Product;
