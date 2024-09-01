"use strict"

const { Schema, model, Types } = require("mongoose") // Erase if already required

const DOCUMENT_NAME = "Inventory"

const COLLECTION_NAME = "Inventories"

// Declare the Schema of the Mongo model
var inventorySchema = new Schema(
  {
    product_id: { type: Types.ObjectId, ref: "products" },
    inventory_location: { type: String, default: "unKnow" },
    inventory_stock: { type: Number, require: true },
    inventory_shop: { type: Types.ObjectId, ref: "shop" },
    inventory_reservations: { type: Array, default: [] },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
)

//Export the model
module.exports = {
  inventory: model(DOCUMENT_NAME, inventorySchema),
}
