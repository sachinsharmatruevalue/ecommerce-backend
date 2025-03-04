const express = require('express');
const router = express.Router();
const userController = require('../Controller/userController');

// Register route
//router.post('/register', authController.register);

router
 .route('/register')
 .post(userController.register)


// Login route
//router.post('/login', authController.login);
router
 .route('/login')
 .post(userController.login)

 //update route
 
 router
 .route('/updatedata/:id')
 .put(userController.updatedata)


 router
 .route('/verifysignup')
 .post(userController. verifyOTPForSignUp )



module.exports = router;