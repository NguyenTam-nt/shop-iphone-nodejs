const express = require("express")
const router = express.Router()
const { asyncHandle } = require("../../helpers/asyncHandler")
const { authenticationV2 } = require("../../auth/authUtils")
const commentController = require("../../controllers/comment.controller")

router.use(authenticationV2)
router.post("", asyncHandle(commentController.createComment))
router.get("", asyncHandle(commentController.getByParentId))
router.delete("", asyncHandle(commentController.deleteComment))

module.exports = router
