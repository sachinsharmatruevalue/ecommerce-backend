const mongoose = require('mongoose')

const AddToCartField = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true

        },
        username:
        {
          type:String 
        },
        items: [
            {
              productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
              productname:{type:String},
              quantity: { type: Number, required: true, min: 1 },
              price: { type: Number, required: true }, // Store price at the time of adding to cart
            }
          ],
          totalPrice: { type: Number, required: true, default: 0 },
          totalItems: { type: Number, required: true, default: 0 },
    },
    { timestamps: true },
    { versionKey: true }
)

module.exports = mongoose.model('cart', AddToCartField)