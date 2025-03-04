const mongoose = require("mongoose");

// Product Schema

const productetailsSchema = new mongoose.Schema(
  {
    size: {
      type: String,
    },
    quantity: {
      type: Number,
    },
    offerprice: {
      type: Number,
    },

    price: {
      type: Number,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:'product'
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

// Create Product model
const Productdetails = mongoose.model("Productdetails", productetailsSchema);

module.exports = Productdetails;
