"use strict"

const { Schema, model, Types } = require("mongoose") // Erase if already required

const DOCUMENT_NAME = "Discount"

const COLLECTION_NAME = "discounts"

// Declare the Schema of the Mongo model
var discountSchema = new Schema(
  {
    discount_name: { type: String, require: true },
    discount_description: { type: String, require: true },
    discount_type: { type: String, default: "fixed_amount" },
    discount_value: { type: Number, require: true },
    discount_code: { type: String, require: true },
    discount_start_date: { type: Date, require: true },
    discount_end_date: { type: Date, require: true },
    discount_max_use: { type: Number, require: true },
    discount_uses_count: { type: Number, require: true },
    discount_users_used: { type: Array, default: [] },
    discount_users_max_use: { type: Number, require: true },
    discount_min_order_value: { type: Number, require: true },
    discount_shop_id: { type: Types.ObjectId, ref: "shop" },
    discount_status: { type: Boolean },
    discount_max_value: { type: Number, require: true },
    discount_applies_to: {
      type: String,
      require: true,
      enum: ["all", "specific"],
    },
    discount_product_ids: { type: Array, default: [] },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
)

//Export the model
module.exports = {
  discount: model(DOCUMENT_NAME, discountSchema),
}
