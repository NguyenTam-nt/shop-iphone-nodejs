"use strict"

const { Schema, model, Types } = require("mongoose") // Erase if already required

const DOCUMENT_NAME = "Order"

const COLLECTION_NAME = "Orders"

// Declare the Schema of the Mongo model
var orderSchema = new Schema(
  {
    order_user_id: { type: Number, require: true },
    order_checkout: { type: Object, default: {} },
    order_shipping: { type: Object, default: {} },
    order_payment: { type: Object, default: {} },
    order_products: { type: Array, default: [] },
    order_trackingNumber: { type: String, default: "#0000101092024" },
    order_status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "cancelled", "delivered"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
)

//Export the model
module.exports = {
  order: model(DOCUMENT_NAME, orderSchema),
}
