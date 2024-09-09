const express = require("express")
const router = express.Router()
const { asyncHandle } = require("../../helpers/asyncHandler")
// const { authenticationV2 } = require("../../auth/authUtils")
const commentController = require("../../controllers/comment.controller")
const UploadController = require("../../controllers/upload.controller")
const { uploadDist, uploadMemory } = require("../../configs/multer.config")

// router.use(authenticationV2)
router.post(
  "/product",
  uploadDist.single("file"),
  asyncHandle(UploadController.uploadImage)
)

router.post(
  "/product/s3",
  uploadMemory.single("file"),
  asyncHandle(UploadController.uploadFileS3)
)

module.exports = router
