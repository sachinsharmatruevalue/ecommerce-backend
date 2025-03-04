const express = require('express');
const router = express.Router();
const productController= require('../Controller/productController')
const {isAdmin}=require('../middleware/auth')
const multer = require('../Multier/multer')


router
 .route('/create')
.post(isAdmin,multer.uploadHandler,productController.productCreate)


router
 .route('/getAll')
.post(isAdmin,productController.productGetAll)

router
 .route('/delete/:id')
.delete(isAdmin,productController.productDelete)

router
 .route('/update/:id')
.patch(isAdmin,multer.uploadHandler,productController.productUpdate)


router
 .route('/getById/:id')
.post(isAdmin,productController.productGetById)

 


module.exports = router;