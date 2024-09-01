"use strict"

const { BadRequestError } = require("../core/error.response")
const { inventory } = require("../models/inventory.model")
const { findProduct } = require("../models/repositories/product.repo")

class InventoryService {
  static async addStockToInventory({
    stock,
    productId,
    shopId,
    location = "",
  }) {
    const product = await findProduct(productId)
    if (!product) throw new BadRequestError("The Product doesn't exist")

    const query = { inventory_shop: shopId, product_id: productId },
      updateSet = {
        $inc: {
          inventory_stock: stock,
        },
        $set: {
          inventory_location: location,
        },
      },
      options = {
        upsert: true,
        new: true,
      }
    return await inventory.findOneAndUpdate(query, updateSet, options)
  }
}

module.exports = InventoryService
