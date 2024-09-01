"use strict"

const { Schema, model } = require("mongoose") // Erase if already required

const DOCUMENT_NAME = "key"

const COLLECTION_NAME = "keys"

// Declare the Schema of the Mongo model
var keyTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: "shop",
    },
    publicKey: {
      type: String,
      required: true,
    },
    privateKey: {
      type: String,
      required: true,
    },
    refreshTokensUsed: {
      type: Array,
      default: [],
    },
    refreshToken: { type: String, require: true },
  },
  {
    collection: DOCUMENT_NAME,
    timestamps: true,
  }
)

//Export the model
module.exports = model(COLLECTION_NAME, keyTokenSchema)
