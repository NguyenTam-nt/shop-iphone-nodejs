const express = require("express")
const router = express.Router()
const accessController = require("../../controllers/access.controller")
const { asyncHandle } = require("../../helpers/asyncHandler")
const { authenticationV2 } = require("../../auth/authUtils")

router.post("/sign-up", asyncHandle(accessController.signUp))
router.post("/login", asyncHandle(accessController.login))

router.use(authenticationV2)

router.post("/logout", asyncHandle(accessController.logout))
router.post("/refresh-token", asyncHandle(accessController.handleRefreshToken))

module.exports = router
