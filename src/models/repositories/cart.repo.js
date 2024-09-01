const { convertToObjectId } = require("../../utils")
const { cart } = require("../cart.model")

const createUserCart = async ({ userId, product }) => {
  const query = { cart_user_id: userId, cart_status: "active" },
    updateOrInsert = {
      $addToSet: {
        cart_products: product,
      },
    },
    options = { upsert: true, new: true }

  return await cart.findOneAndUpdate(query, updateOrInsert, options)
}

const updateCartQuantity = async ({ userId, product }) => {
  const { productId, quantity } = product
  const query = {
      cart_user_id: userId,
      "cart_products.productId": productId,
      cart_status: "active",
    },
    updateSet = {
      $in: {
        "cart_product.$.quantity": quantity,
      },
    },
    options = { upsert: true, new: true }

  return await cart.findOneAndUpdate(query, updateSet, options)
}

const findCartIdById = async (cartId) => {
  return cart
    .findOne({
      _id: convertToObjectId(cartId),
      cart_status: "active",
    })
    .lean()
}

module.exports = {
  createUserCart,
  updateCartQuantity,
  findCartIdById,
}
