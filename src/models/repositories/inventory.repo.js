const { convertToObjectId } = require("../../utils")
const { inventory } = require("../inventory.model")

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unKnow",
}) => {
  return await inventory.create({
    product_id: productId,
    inventory_shop: shopId,
    inventory_stock: stock,
    inventory_location: location,
  })
}

const reservationInventory = async ({ productId, quantity, cartId }) => {
  const query = {
      inventory_productId: convertToObjectId(productId),
      inventory_stock: { $gte: quantity },
    },
    updateSet = {
      $inc: {
        inventory_stock: -quantity,
      },
      $push: {
        inventory_reservations: {
          quantity,
          cartId,
          createOn: new Date(),
        },
      },
    },
    options = { upsert: true, new: true }

  return await inventory.updateOne(query, updateSet, options)
}

module.exports = {
  insertInventory,
  reservationInventory,
}
