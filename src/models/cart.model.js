"use strict"

const { Schema, model, Types } = require("mongoose") // Erase if already required

const DOCUMENT_NAME = "carts"

const COLLECTION_NAME = "Cart"

// Declare the Schema of the Mongo model
var cartSchema = new Schema(
  {
    cart_user_id: { type: Types.ObjectId, require: true },
    cart_status: {
      type: String,
      require: true,
      enum: ["active, completed", "failed", "pending"],
      default: "active",
    },
    cart_products: { type: Array, require: true, default: [] },
    cart_count_product: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
)

//Export the model
module.exports = {
  cart: model(DOCUMENT_NAME, cartSchema),
}
