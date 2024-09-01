"use strict"

const { NotFoundError } = require("../core/error.response")
const { cart } = require("../models/cart.model")
const {
  createUserCart,
  updateCartQuantity,
} = require("../models/repositories/cart.repo")
const { findProduct } = require("../models/repositories/product.repo")

class CartService {
  static async addToCart({ userId, product: {} }) {
    const userCart = await cart.findOne({
      cart_user_id: userId,
    })

    if (!userCart) {
      return await createUserCart({ userId, product })
    }

    if (!userCart.cart_products.length) {
      userCart.cart_products = { product }
      return await userCart.save()
    }

    return await updateCartQuantity({ userId, product })
  }

  static async addToCartV2({ userId, product }) {
    const { productId, quantity, oldQuantity } = product

    const foundProduct = await findProduct({ product_id: productId })
    if (!foundProduct) {
      throw new NotFoundError("")
    }

    if (foundProduct.product_shop.toString() !== product.shopId) {
      throw new NotFoundError("Product doesn't belong to the Shop")
    }

    if (quantity === 0) {
    }

    return await updateCartQuantity({ userId, product })
  }

  static async deleteProductCart({ userId, productId }) {
    const query = { cart_user_id: userId, cart_status: "active" },
      updateSet = {
        $pull: {
          cart_products: {
            productId,
          },
        },
      }

    const deleteCart = await cart.updateOne(query, updateSet)
    return deleteCart
  }

  static async getListCart(userId) {
    return await cart
      .findOne({
        cart_user_id: userId,
      })
      .lean()
  }
}

module.exports = CartService
