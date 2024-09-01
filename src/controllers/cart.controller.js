"use strict"

const { SuccessResponse } = require("../core/success.response")
const CartService = require("../services/cart.service")

class CartController {
  addToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Add to Cart Successfully",
      metaData: await CartService.addToCart(req.body),
    }).send(res)
  }

  update = async (req, res, next) => {
    new SuccessResponse({
      message: "Add to Cart Successfully",
      metaData: await CartService.addToCartV2(req.body),
    }).send(res)
  }

  delete = async (req, res, next) => {
    new SuccessResponse({
      message: "Delete product Cart Successfully",
      metaData: await CartService.deleteProductCart(req.body),
    }).send(res)
  }

  listOfCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Get List Cart Successfully",
      metaData: await CartService.getListCart(req.query.userId),
    }).send(res)
  }
}

module.exports = new CartController()
