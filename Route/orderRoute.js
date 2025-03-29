const express = require('express');
const router = express.Router();
const orderController = require('../Controller/orderController.js');


router
.route('/')
.post(orderController.orderItem)

router
.route('/:orderId')
.delete(orderController.orderCancel)

router
.route('/:orderId')
.get(orderController.Getorder)
router
.route('/')
.get(orderController.getAllOrders)

router
.route('/:orderId')
.get(orderController.orderUpdate)






module.exports=router