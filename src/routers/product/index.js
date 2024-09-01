const express = require("express")
const router = express.Router()
const { asyncHandle } = require("../../helpers/asyncHandler")
const ProductController = require("../../controllers/product.controller")
const { authenticationV2 } = require("../../auth/authUtils")

router.get("/search", asyncHandle(ProductController.searchProduct))
router.get("", asyncHandle(ProductController.getAllProduct))
router.get("", asyncHandle(ProductController.getAllProduct))
router.get("/:product_id", asyncHandle(ProductController.getProduct))

router.use(authenticationV2)
router.post("/create", asyncHandle(ProductController.createProduct))
router.patch("/:productId", asyncHandle(ProductController.updateProduct))
router.post("/publish/:id", asyncHandle(ProductController.publishProduct))
router.post("/unpublish/:id", asyncHandle(ProductController.unPublishProduct))

router.get("/draft-all", asyncHandle(ProductController.getAllDraftOfShop))
router.get("/publish-all", asyncHandle(ProductController.getAllPublishOfShop))

module.exports = router
