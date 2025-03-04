const express = require('express');
const router = express.Router();
const subCategoryController= require('../Controller/subCategoryController')
const {isAdmin}=require('../middleware/auth')
const multer = require('../Multier/multer')


router
 .route('/create')
.post(isAdmin,multer.singleFileUpload,subCategoryController.subCategoryCreate)


router
.route('/update/:id')
.patch(isAdmin,multer.singleFileUpload,subCategoryController.subCategoryUpdate)

router
.route('/delete/:id')
.delete(isAdmin,subCategoryController.subCategoryDelete)
router
.route('/getall')
.post(isAdmin,subCategoryController.subCategoryGetAll)

router
.route('/getById/:id')
.post(isAdmin,subCategoryController.subCategoryGetById)



 


module.exports = router;