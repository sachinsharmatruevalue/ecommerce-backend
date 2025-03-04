const express = require('express');
const router = express.Router();
const bannerController = require('../Controller/bannerController');
const multer = require('../Multier/multer')
const {isAdmin}=require('../middleware/auth')
router
.route('/getAll')
.post(isAdmin,bannerController.getAll);

router
.route('/create')
.post(isAdmin,multer.singleFileUpload,bannerController.create);

router
.route('/getById/:id')
.post(isAdmin,bannerController.getById);

router
.route('/update/:id')
.patch(isAdmin,multer.singleFileUpload,bannerController.update);


router
.route('/delete/:id')
.delete(isAdmin,bannerController.delete);





module.exports = router;