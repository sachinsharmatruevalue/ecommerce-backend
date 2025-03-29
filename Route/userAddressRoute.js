const express = require("express");
const router = express.Router();
const userAddressController = require("../Controller/userAdressController");


router.route("/").post(userAddressController.CreateUserAddress);

router.route("/").get( userAddressController.GetAllAddresses);

router
  .route("/:id")
  .delete( userAddressController.DeleteUserAddress);

router
  .route("/:id")
  .patch(userAddressController.UpdateUserAddress);

router
  .route("/:id")
  .get( userAddressController.GetByIdUserAddress);

module.exports = router;
