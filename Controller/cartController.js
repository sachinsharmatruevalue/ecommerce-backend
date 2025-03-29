
const Cart = require('../Model/cart');
const User=require('../Model/user');
const Product=require('../model/product');
exports. addToCart = async (req, res) => {
    try {
        console.log("Incoming Request Body:", req.body); // Debugging

        // Validate user ID
        if (!req.body.userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        // Fetch user details
        const userDoc = await User.findById(req.body.userId);
        if (!userDoc) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const username = userDoc.name; // Assign user's name

        // Validate product ID
        if (!req.body.productId) {
            return res.status(400).json({ success: false, message: "Product ID is required" });
        }

        // Fetch product details
        const productDoc = await Product.findById(req.body.productId);
        if (!productDoc) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Assign product details
        const productname = productDoc.name; // Default if missing
        const price = productDoc.price;

        console.log("Fetched Product Name:", productname); // Debugging

        // Ensure quantity is provided and valid
        const quantity = req.body.quantity;
        if (!quantity || quantity < 1) {
            return res.status(400).json({ success: false, message: "Quantity must be at least 1" });
        }

        let cart = await Cart.findOne({ userId: req.body.userId });

        if (!cart) {
            // Create a new cart if it doesn't exist
            cart = new Cart({
                userId: req.body.userId,
                username: username,
                items: [{
                    productId: req.body.productId,
                    productname: productname, // Ensure product name is stored
                    quantity: quantity,
                    price: price,
                }],
                totalItems: 1,
                totalPrice: quantity * price,
            });
        } else {
            // If cart exists, check if the item is already in the cart
            const existingItem = cart.items.find(item => item.productId.toString() === req.body.productId);

            if (existingItem) {
                // Update quantity if item already exists
                existingItem.quantity += quantity;
            } else {
                // Add new item to cart
                cart.items.push({
                    productId: req.body.productId,
                    productname: productname, // Ensure product name is stored
                    quantity: quantity,
                    price: price,
                });
            }

            // Recalculate total items and total price
            cart.totalItems = cart.items.length;
            cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);
        }

        await cart.save();
        console.log("Cart Saved:", cart); // Debugging
        res.status(200).json({ success: true, message: "Cart updated successfully", cart });

    } catch (err) {
        console.error("Error:", err); // Debugging
        res.status(500).json({ success: false, message: err.message });
    }
};


exports. getCart = async (req, res) => {
    try {
        const id = req.params.id;
        const cart = await Cart.findById(id).populate('userId');
       
        res
          .status(200)
          .json({
            status: true,
            message: "cart Fetch Successfully",
            data: cart,
          });
      } catch (err) {
        res.status(500).json({ status: false, error: err.message });
      }


};
exports. cartCount = async (req, res) => {
    try {
        const { userId } = req.query;
        console.log("req.query", req.query);

        if (!userId) {
            return res.status(400).json({ success: false, message: "Please provide the userId" });
        }

        const cart = await Cart.findOne({ userId: userId });

        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        // Calculate total count (sum of all item quantities)
        const totalCount = cart.items.reduce((total, item) => total + item.quantity, 0);

        return res.status(200).json({ success: true, message: "Cart data retrieved successfully", data: totalCount });

    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports. cartRemove = async (req, res) => {
    try {
        const cart= await Cart.findById(req.params.id);
        if (!cart) {
          return res
            .status(404)
            .json({ status: false, message: "cart Not Found" });
        }
        
        await Cart.findByIdAndDelete(req.params.id);
    
        res
          .status(200)
          .json({
            status: true,
            message: "cart  Delete Successfuly  ",
            data: cart,
          });
      } catch (err) {
        console.log(err);
        res.status(500).json({ status: false, error: err.message });
      }
};

exports. getAllCart = async (req, res) => {
    try {
        const cart = await Cart.find()
            .sort({ createdAt: -1 })
            .populate("items.productId", "images name price"); // ✅ Correct path
        
        res.status(200).json({
            status: true,
            message: "Cart retrieved successfully",
            data: cart,
        });
    } catch (err) {
        res.status(500).json({ status: false, error: err.message });
    }
};


