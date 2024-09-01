const express = require("express")
const router = express.Router()
const { asyncHandle } = require("../../helpers/asyncHandler")
const { authenticationV2 } = require("../../auth/authUtils")
const cartController = require("../../controllers/cart.controller")

router.use(authenticationV2)
router.post("", asyncHandle(cartController.addToCart))
router.delete("", asyncHandle(cartController.delete))
router.get("", asyncHandle(cartController.listOfCart))
router.put("", asyncHandle(cartController.update))

module.exports = router
