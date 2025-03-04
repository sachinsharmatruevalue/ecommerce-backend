const express = require('express');
const router = express.Router();
const adminController = require('../Controller/adminController');
const {isAdmin}=require('../middleware/auth')
const multer = require('../Multier/multer')


router
 .route('/register')
 .post(adminController.register)


 
router
.route('/login')
.post(adminController.login)

router
 .route('/createAdmin')
 .post(isAdmin,adminController.createAdmin)



router
 .route('/change-password')
 .patch(isAdmin,adminController.changePassword)

 router
.route('/logout')
.post(isAdmin,adminController.logOut)

router
.route('/updateAdmin/:id')
.patch(isAdmin,multer.singleFileUpload,adminController.updateAdmin)

// router
// .route('/forgetpassword')
// .post(isAdmin,multer.singleFileUpload,adminController.forgetpassword)



module.exports = router;