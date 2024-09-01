"use strict"

const { BadRequestError } = require("../core/error.response")
const { order } = require("../models/order.model")
const { findCartIdById } = require("../models/repositories/cart.repo")
const { checkProductByServer } = require("../models/repositories/product.repo")
const { getDiscountAmount } = require("./discount.service")
const { acquiredLock, releaseLock } = require("./redis.service")

class CheckoutService {
  static async checkoutCartReview({ cartId, userId, shop_order_ids }) {
    const foundCart = await findCartIdById(cartId)

    if (!foundCart) {
      throw new BadRequestError("Cart doesn't exist")
    }

    const checkoutOrder = {
        totalPrice: 0,
        feeShip: 0,
        totalDiscount: 0,
        totalCheckout: 0,
      },
      shopOrderIdsNew = []

    for (let index = 0; index < shop_order_ids.length; index++) {
      const {
        shopId,
        shopDiscounts = [],
        itemProducts = [],
      } = shop_order_ids[index]

      // checkout product available

      const checkProductServer = await checkProductByServer(itemProducts)

      if (!checkProductServer[0]) throw new BadRequestError("Order wrong!")

      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + product.quantity * product.price
      }, 0)

      checkoutOrder.totalPrice += checkoutPrice
      const itemCheckout = {
        shopId,
        shopDiscounts,
        priceRaw: checkoutPrice,
        priceApplyCheckout: checkoutPrice,
        itemProducts,
      }

      if (shopDiscounts.length > 0) {
        const { totalOrder, discount } = await getDiscountAmount({
          code: shopDiscounts[0].code,
          userId,
          shopId,
          products: checkProductServer,
        })

        checkoutOrder.totalDiscount += discount

        if (discount > 0) {
          itemCheckout.priceApplyCheckout = checkoutPrice - discount
        }
      }

      checkoutOrder.totalCheckout += itemCheckout.priceApplyCheckout
      shopOrderIdsNew.push(itemCheckout)
    }

    return {
      shop_order_ids,
      shopOrderIdsNew,
      checkoutOrder,
    }
  }

  static async orderByUser({
    shopOrderIds,
    cartId,
    userId,
    userAddress = {},
    userPayment = {},
  }) {
    const { shopOrderIdsNew, checkoutOrder } =
      await CheckoutService.checkoutCartReview({
        cartId,
        userId,
        shop_order_ids: shopOrderIds,
      })

    const products = shopOrderIdsNew.flatMap((order) => order.itemProducts)

    const acquiredProduct = []

    for (let index = 0; index < products.length; index++) {
      const { productId, quantity } = products[index]
      const keyClock = await acquiredLock(productId, quantity, cartId)
      acquiredProduct.push(keyClock ? true : false)

      if (keyClock) {
        await releaseLock(keyClock)
      }
    }
    // check if having a product out of stock in the store
    if (acquiredProduct.includes(false)) {
      throw new BadRequestError(
        "Some products in your order had updated, please go back to cart page"
      )
    }
    const newOrder = await order.create({
      order_user_id: userId,
      order_checkout: checkoutOrder,
      order_shipping: userAddress,
      order_payment: userPayment,
    })

    if (newOrder) {
      // remove product of the user's cart
    }

    return newOrder
  }
}

module.exports = CheckoutService
