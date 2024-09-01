"use strict"

const { model, Schema, Types } = require("mongoose")

const DOCUMENT_NAME = "Apikey"

const COLLECTION_NAME = "Apikeys"

// Declare the Schema of the Mongo model
var apiKeySchema = new Schema(
  {
    key: {
      type: String,
      require: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: [String],
      required: true,
      enum: ["0000", "111", "222"],
    },
  },
  {
    collection: DOCUMENT_NAME,
    timestamps: true,
  }
)

//Export the model
module.exports = model(COLLECTION_NAME, apiKeySchema)
