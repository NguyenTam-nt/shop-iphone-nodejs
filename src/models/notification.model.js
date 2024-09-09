"use strict"

const { Schema, model, Types } = require("mongoose") // Erase if already required

const DOCUMENT_NAME = "Notification"

const COLLECTION_NAME = "Notifications"

// Declare the Schema of the Mongo model
var notificationSchema = new Schema(
  {
    notify_type: {
      type: String,
      enum: ["ORDER-001", "ORDER-002", "PROMOTION-001", "SHOP-001"],
      require: true,
    },
    notify_sender_id: { type: Types.ObjectId, require: true },
    notify_receiver_id: { type: Number, require: true },
    notify_content: { type: String, require: true },
    notify_option: { type: Object, default: {} },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
)

//Export the model
module.exports = {
  notification: model(DOCUMENT_NAME, notificationSchema),
}
