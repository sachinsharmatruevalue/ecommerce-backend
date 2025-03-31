const express = require('express');
const router = express.Router();
const orderController = require('../Controller/orderController.js');


router
.route('/')
.post(orderController.orderItem)

router
.route('/:id')
.delete(orderController.orderCancel)

router
.route('/:id')
.get(orderController.Getorder)
router
.route('/')
.get(orderController.getAllOrders)

router 
.route('/:id')
.get(orderController.orderUpdate)






module.exports=router