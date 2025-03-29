const express = require('express');
const router = express.Router();
const cartController = require('../Controller/cartController.js');


router
.route('/')
.post(cartController.addToCart)

router
.route('/:id')
.get(cartController.getCart)
router
.route('/')
.get(cartController.getAllCart)

router
.route('/')
.get(cartController.cartCount)

router
.route('/:id')
.delete(cartController.cartRemove)




module.exports=router