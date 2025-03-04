const express = require('express');
const notificationController = require('../Controller/notificationController');
const { isAdmin} = require('../middleware/auth');
const multer = require('../Multier/multer')

const router = express.Router();

// Auth routes *****************************************************************

  router
  .route('/')
  .post(isAdmin,multer.singleFileUpload,notificationController.createNotification)
  
  router
  .route('/getAll')
  .post(isAdmin,notificationController.getAllNotification)
  router
  .route('/:id')
  .delete(isAdmin,notificationController.deleteNotification)
  .patch(isAdmin,multer.singleFileUpload,notificationController.updateNotification)

  router
  .route('/getById/:id')
  .post(isAdmin,notificationController.getNotification)

  

module.exports = router;