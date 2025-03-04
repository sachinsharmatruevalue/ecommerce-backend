const express = require('express');
const router = express.Router();
const categoryController= require('../Controller/categoryController')
const {isAdmin}=require('../middleware/auth')
const multer = require('../Multier/multer')


router
 .route('/create')
.post(isAdmin,multer.singleFileUpload,categoryController.categoryCreate)


router
.route('/update/:id')
.patch(isAdmin,multer.singleFileUpload,categoryController.categoryUpdate)

router
.route('/delete/:id')
.delete(isAdmin,categoryController.categoryDelete)
router
.route('/getAll')
.post(isAdmin,categoryController.categoryGetAll)
router
.route('/getById/:id')
.post(isAdmin,categoryController.categoryGetById)



 


module.exports = router;