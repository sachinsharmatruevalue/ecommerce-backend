const express = require('express');
const router = express.Router();
const productDetailsController= require('../Controller/productDetailsController')
const {isAdmin}=require('../middleware/auth')



router
 .route('/create')
.post(isAdmin,productDetailsController.create)


router
.route('/update/:id')
.patch(isAdmin,productDetailsController.update)

router
.route('/delete/:id')
.delete(isAdmin,productDetailsController.delete)
router
.route('/getAll')
.post(isAdmin,productDetailsController.getAll)
router
.route('/getById/:id')
.post(isAdmin,productDetailsController.getById)



 


module.exports = router;