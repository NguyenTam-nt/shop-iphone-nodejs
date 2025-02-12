"use strict"

const { Schema, model } = require("mongoose") // Erase if already required

const DOCUMENT_NAME = "shop"

const COLLECTION_NAME = "shop"

// Declare the Schema of the Mongo model
var shopSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    verify: {
      type: Schema.Types.Boolean,
      default: false,
    },
    roles: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
)

//Export the model
module.exports = model(DOCUMENT_NAME, shopSchema)
