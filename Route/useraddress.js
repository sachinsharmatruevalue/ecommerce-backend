const express = require('express');
const router = express.Router();
const userAddressController= require('../Controller/userAdressController')
const {isAdmin}=require('../middleware/auth')



router
 .route('/create')
.post(isAdmin,userAddressController.create)


router
 .route('/getall')
.post(isAdmin,userAddressController.getAll)

router
 .route('/delete/:id')
.delete(isAdmin,userAddressController.delete)

router
 .route('/update/:id')
.patch(isAdmin,userAddressController.update)


router
 .route('/getbyid/:id')
.post(isAdmin,userAddressController.getById)

 


module.exports = router;