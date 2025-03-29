const ProductDetails = require("../Model/productDetails");

exports.create = async (req, res) => {
  try {
    const product = await ProductDetails.create(req.body);
    res
      .status(201)
      .json({ status: true, message: "Product Detail create ", data: product });
  } catch (err) {
    res.status(400).json({ status: false, error: err.message });
  }
};
exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await ProductDetails.findById(id);
    if (!product) {
      res
        .status(404)
        .json({ status: false, message: "Product Detail  Not Found" });
    }
    Object.keys(req.body).forEach((key) => {
      product[key] = req.body[key];
    });
    await product.save();
    res
      .status(400)
      .json({
        status: true,
        message: "Product Detail  Updated ",
        data: product,
      });
  } catch (err) {
    res.status(400).json({ status: false, error: err.message });
  }
};
exports.delete = async (req, res) => {
  
  try {
    const id = req.params.id;
  const product = await ProductDetails.findById(id);
    if (!product) {
      res
        .status(404)
        .json({ status: false, message: "Product Detail  Not Found" });
    }
    await ProductDetails.findByIdAndDelete(product);
    res.status(200).json({ status: true, message: "Product Detail  Deleted " });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};
exports.getAll = async (req, res) => {
  try {
    const product = await ProductDetails.find().sort({ created: -1 });
    if (!product) {
      return res
        .status(404)
        .json({ status: false, message: "Product Detail  Not Found" });
    }
    res
      .status(200)
      .json({
        status: true,
        message: " Product Detail  Fetch Successfuly",
        data: product,
      });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};
exports.getById = async (req, res) => {
  try {
    const id = req.params.id;
    const product =  await ProductDetails.findById(id).populate('product');
    if (!product) {
      return res
        .status(404)
        .json({ status: false, message: "Product Detail  Not Found" });
    }
    res
      .status(200)
      .json({
        status: true,
        message: "Product Detail  Fetch Successfully",
        data: product,
      });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};
