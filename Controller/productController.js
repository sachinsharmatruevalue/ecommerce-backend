const Product = require("../model/product");
const Category = require("../model/category");
const SubCategory = require("../model/subCategory");
const Brand = require("../model/brand");
const User=require("../Model/user");
const path = require("path");
const fs = require("fs");

exports.CreateProduct = async (req, res) => {
  try {
    if (req.files.images && req.files.images.length > 0) {
      req.body.images = req.files.images.map(
        (file) => `Uploads/${file.filename}`
      );
    }
    if (req.body.productkey) {
      req.body.productkey = JSON.parse(req.body.productkey);
    }
    

    // Fetch Category, SubCategory, and Brand Names
    const categoryDocs = await Category.find({
      _id: { $in: req.body.category },
    });
    const subCategoryDocs = await SubCategory.find({
      _id: { $in: req.body.subCategory },
    });
    const brandDoc = await Brand.find({ _id: { $in: req.body.brand } });
    // const brandDoc = await Brand.findById(req.body.brand);

    // Extract names from fetched documents
    req.body.categoryname = categoryDocs.map((cat) => cat.name);
    req.body.subCategoryname = subCategoryDocs.map((sub) => sub.name);
    req.body.brandname = brandDoc.map((brand) => brand.name);
    // req.body.brandName = brandDoc ? brandDoc.name : "";
    console.log(req.body.categoryname);
    console.log(req.body.subCategoryname);
    console.log(req.body.brandName);

    // Create Product
    const product = await Product.create(req.body);

    res
      .status(201)
      .json({ status: true, message: "Product created", data: product });
  } catch (err) {
    res.status(400).json({ status: false, error: err.message });
  }
};

exports.GetAllProduct = async (req, res) => {
  try {
    const product = await Product.find().populate("category") // Populate category field, only returning 'name'
    .populate("subCategory") // Populate subcategory field, only returning 'name'
    .populate("brand")

  .sort({ created: -1 });

    if (product.length === 0) {
      return res
        .status(404)
        .json({ status: false, message: "Product Not Found" });
    }

    res
      .status(200)
      .json({
        status: true,
        message: "Product Fetch Successfully",
        data: product,
      });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};

exports.DeleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    // Delete images if they exist
    if (product.images && product.images.length > 0) {
      product.images.forEach((images) => {
        const imagePath = path.join(
          __dirname,
          "../Uploads",
          path.basename(images)
        );
        if (fs.existsSync(imagePath)) {
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.error("Failed to delete images:", err);
            }
          });
        }
      });
    }

    // Delete the product
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(500).json({ message: "Failed to delete product" });
    }

    res
      .status(200)
      .json({
        status: true,
        message: "Product Deleted Successfully",
        data: deletedProduct,
      });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ status: false, error: err.message });
  }
};

exports.UpdateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the existing product
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ status: false, message: "Product not found" });
    }

    // Fetch Category, SubCategory, and Brand Names
    const categoryDocs = await Category.find({ _id: { $in: req.body.category || [] } });
    const subCategoryDocs = await SubCategory.find({ _id: { $in: req.body.subCategory || [] } });
    const brandDoc = req.body.brand ? await Brand.findById(req.body.brand) : null;

    // Extract names safely
    req.body.categoryname = categoryDocs.map((cat) => cat.name);
    req.body.subCategoryname = subCategoryDocs.map((sub) => sub.name);
    req.body.brandname = brandDoc ? brandDoc.name : "";

    // Separate images from the request body
    const { images, ...updateFields } = req.body;

    // Ensure productkey is properly parsed if sent as a JSON string
    if (typeof updateFields.productkey === "string") {
      try {
        updateFields.productkey = JSON.parse(updateFields.productkey);
      } catch (error) {
        return res.status(400).json({ status: false, message: "Invalid productkey format" });
      }
    }

    // Update non-image fields
    const updatedProduct = await Product.findByIdAndUpdate(id, { $set: updateFields }, { new: true });

    // Handle new image uploads (if any)
    if (req.files && req.files["images"]) {
      const newImages = req.files["images"].map((file) => `Uploads/${file.filename}`);

      // Append new images without removing existing ones
      await Product.findByIdAndUpdate(id, { $push: { images: { $each: newImages } } }, { new: true });
    }

    // Fetch and return the updated product
    const finalProduct = await Product.findById(id);
    res.status(200).json({ status: true, message: "Product Updated Successfully", data: finalProduct });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ status: false, error: err.message });
  }
};
exports.GetByIdProduct = async (req, res) => {
 
  try {
    const id = req.params.id;
    const product = await Product.findById(id).populate('category','subCategory','Brand');
    res
      .status(400)
      .json({
        status: true,
        message: " Product fetch Successfully",
        data: product,
      });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};

exports.getSubCategoryByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params; // Get categoryId from request parameters

    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    // Find subcategories matching the given category ID
    const subcategories = await SubCategory.find({ Category: categoryId });

    res.status(200).json(subcategories);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res.status(500).json({ message: "Failed to fetch subcategories" });
  }
};

exports.deletedProductimage = async (req, res) => {
  try {
    const { imagePath, productId } = req.body;

    console.log("Received data for deletion:", { imagePath, productId });

    if (!imagePath || !productId) {
      return res.status(400).json({ message: "Missing required data" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Remove image from product array
    product.images = product.images.filter(img => img !== imagePath);
    await product.save();

    // Fix file path issue
    const filePath = path.join(__dirname, "../", imagePath);
    console.log("Attempting to delete file:", filePath);

    // Check and delete file
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        } else {
          console.log("File deleted successfully:", filePath);
        }
      });
    } else {
      console.log("File not found:", filePath);
    }

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ message: "Server error" });
  }

};


