"use strict"

const { Schema, model, Types } = require("mongoose") // Erase if already required

const DOCUMENT_NAME = "Comment"

const COLLECTION_NAME = "Comments"

// Declare the Schema of the Mongo model
var commentSchema = new Schema(
  {
    comment_product_id: { type: Types.ObjectId, ref: "product" },
    comment_user_id: { type: Types.ObjectId, require: true, default: 1 },
    comment_content: { type: String, default: "text" },
    comment_left: { type: Number, default: 0 },
    comment_right: { type: Number, default: 0 },
    comment_parent_id: { type: Types.ObjectId, ref: DOCUMENT_NAME },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
)

//Export the model
module.exports = {
  comment: model(DOCUMENT_NAME, commentSchema),
}
