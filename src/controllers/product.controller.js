"use strict"

const { SuccessResponse } = require("../core/success.response")
const productService = require("../services/product.service")

class ProductController {
  static async createProduct(req, res, next) {
    new SuccessResponse({
      message: "Create Product successfully!!",
      metaData: await productService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user?.userId,
      }),
    }).send(res)
  }

  /**
   * @dev get all draft for shop
   * @param {Number} limit
   * @param {Number} skip
   * @returns {JSON}
   */
  static async getAllDraftOfShop(req, res, next) {
    new SuccessResponse({
      message: "List Product Draft Product Successfully",
      metaData: await productService.findDraftsForShopService(req.user?.userId),
    }).send(res)
  }

  /**
   * @dev get all draft for shop
   * @param {Number} limit
   * @param {Number} skip
   * @returns {JSON}
   */
  static async getAllPublishOfShop(req, res, next) {
    new SuccessResponse({
      message: "List Product Publish Product Successfully",
      metaData: await productService.findPublishForShopService(
        req.user?.userId
      ),
    }).send(res)
  }

  static async publishProduct(req, res, next) {
    new SuccessResponse({
      message: "Publish Product Successfully",
      metaData: await productService.publishProductByShopService({
        product_shop: req.user?.userId,
        product_id: req.params.id,
      }),
    }).send(res)
  }

  static async unPublishProduct(req, res, next) {
    new SuccessResponse({
      message: "UnPublish Product Successfully",
      metaData: await productService.publishProductByShopService({
        product_shop: req.user?.userId,
        product_id: req.params.id,
      }),
    }).send(res)
  }

  static async searchProduct(req, res, next) {
    new SuccessResponse({
      message: "Search Product Successfully",
      metaData: await productService.searchProductService(req.query),
    }).send(res)
  }

  static async getAllProduct(req, res, next) {
    new SuccessResponse({
      message: "Get Product Successfully",
      metaData: await productService.findAllProductService(req.query),
    }).send(res)
  }

  static async getProduct(req, res, next) {
    new SuccessResponse({
      message: "Get Product Successfully",
      metaData: await productService.findProductService({
        product_id: req.params.product_id,
      }),
    }).send(res)
  }

  static async updateProduct(req, res, next) {
    console.log({ body: req.body })
    new SuccessResponse({
      message: "Update Product Successfully",
      metaData: await productService.updateProduct({
        productId: req.params.productId,
        payload: {
          ...req.body,
          product_shop: req.user?.userId,
        },
        type: req.body.product_type,
      }),
    }).send(res)
  }
}

module.exports = ProductController
