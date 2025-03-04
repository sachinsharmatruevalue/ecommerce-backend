const express = require('express');
const router = express.Router();
const brandController = require('../Controller/brandController');

const {isAdmin}=require('../middleware/auth')


router
.route('/create')
.post(isAdmin,brandController.create);

router
.route('/update/:id')
.patch(isAdmin,brandController.update);

router
.route('/getAll')
.post(isAdmin,brandController.getAll);

router
.route('/get/:id')
.post(isAdmin,brandController.get);

router
.route('/delete/:id')
.delete(isAdmin,brandController.delete);








module.exports = router;