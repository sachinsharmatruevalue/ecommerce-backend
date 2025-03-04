const Product = require("../Model/product");
const Category = require("../Model/category");
const SubCategory = require("../Model/subCategory");
const Brand = require("../Model/brand");
// const { deleteFile } = require("../Route/deletephotounlink");
const path = require("path");
const fs = require("fs");

exports.productCreate = async (req, res) => {
    try {
      if (req.files.images && req.files.images.length > 0) {
      req.body.images = req.files.images.map(file => `Uploads/${file.filename}`);
    }
  
      // Fetch Category, SubCategory, and Brand Names
      const categoryDocs = await Category.find({ _id: { $in: req.body.category } });
      const subCategoryDocs = await SubCategory.find({ _id: { $in: req.body.subCategory } });
      const brandDoc = await Brand.findById(req.body.brand);
  
      // Extract names from fetched documents
      req.body.categoryname = categoryDocs.map(cat => cat.name);
      req.body.subCategoryname = subCategoryDocs.map(sub => sub.name);
      req.body.brandName = brandDoc ? brandDoc.name : "";
  
      // Create Product
      const product = await Product.create(req.body);
  
      res.status(201).json({ status: true, message: "Product created", data: product });
    } catch (err) {
      res.status(400).json({ status: false, error: err.message });
    }
  };

exports.productGetAll = async (req, res) => {
  const getAllproduct = await Product.find().sort({ created: -1 });
  try {
    if (getAllproduct.length == 0) {
      return res
        .status(404)
        .json({ status: false, messgae: "Data not found " });
    }
    res
      .status(400)
      .json({ status: true, message: "Data access", data: getAllproduct });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};

exports.productDelete = async (req, res) => {
  try {
    const deleteProduct = await Product.findById(req.params.id);
    if (!deleteProduct) {
      return res.status(404).json({ message: "Data not found" });
    }
    if (deleteProduct.image) {
      const imagepath = path.join(
        __dirname,
        "../Uploads",
        path.basename(deleteProduct.image)
      );
      if (fs.existsSync(imagepath)) {
        fs.unlink(imagepath, (err) => {
          if (err) {
            console.err("Failed to delete", err);
          }
        });
      }
    }
    await Product.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ status: true, message: "Data delete ", data: deleteProduct });
  } catch (err) {
    // console.log(err)
    res.status(500).json({ status: false, error: err.message });
  }
};

exports.productUpdate = async (req, res) => {
    try {
        const { id } = req.params;
    
        // Find the existing product
        const product = await Product.findById(id);
        if (!product) {
          return res.status(404).json({ status: false, message: "Product not found" });
        }
           // Fetch Category, SubCategory, and Brand Names
      const categoryDocs = await Category.find({ _id: { $in: req.body.category } });
      const subCategoryDocs = await SubCategory.find({ _id: { $in: req.body.subCategory } });
      const brandDoc = await Brand.findById(req.body.brand);
  
      // Extract names from fetched documents
      req.body.categoryname = categoryDocs.map(cat => cat.name);
      req.body.subCategoryname = subCategoryDocs.map(sub => sub.name);
      req.body.brandName = brandDoc ? brandDoc.name : "";


      if (req.files && req.files.length > 0) {
        if (product.images && product.images.length > 0) {
          product.images.forEach((imgPath) => {
            const filePath = path.join(__dirname, "../Uploads", imgPath); // Adjust path based on storage
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          });
        }
  
        // Assign new images
        req.body.images = req.files.map(file => `Uploads/${file.filename}`);
      }
        // Update the product
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
    
        res.status(200).json({ status: true, message: "Product updated successfully", data: updatedProduct });
      } catch (err) {
        res.status(400).json({ status: false, error: err.message });
      }
};

exports.productGetById = async (req, res) => {
  const id = req.params.id;
  const getProduct = await Product.findById(id);
  try {
    if (getProduct.length == 0) {
      return res
        .status(404)
        .json({ status: false, messgae: "Data product found" });
    }
    res
      .status(400)
      .json({ status: true, message: " Data access", data: getProduct });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};
