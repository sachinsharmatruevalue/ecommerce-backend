const express = require("express");
const router = express.Router();
const wishlistController = require("../Controller/wishlistController.js");


router.get("/", wishlistController.getAllWishlist);

router.route("/:userId/").post(wishlistController.addToWishlist);
router.route("/:userId").get(wishlistController.getWishlist);
router.route("/:userId").get(wishlistController.updateWishlist);
router.route("/:userId/remove/:productId").delete(wishlistController.deleteWishlist);

module.exports = router;
