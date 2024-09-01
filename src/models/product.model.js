"use strict"

const { Schema, model } = require("mongoose")
const slugify = require("slugify")

const DOCUMENT_NAME = "product"

const COLLECTION_NAME = "products"

const productSchema = new Schema(
  {
    product_name: { type: String, require: true },
    product_thumb: { type: String, require: true },
    product_description: String,
    product_price: { type: Number, require: true },
    product_slug: { type: String },
    product_quantity: { type: Number, require: true },
    product_type: {
      type: String,
      require: true,
      enum: ["Electronics", "Clothing", "Furniture"],
    },
    product_shop: { type: Schema.Types.ObjectId, ref: "shop" },
    product_attributes: { type: Schema.Types.Mixed, require: true },
    product_ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1"],
      max: [5, "Rating must be below 5.0"],
      set: (value) => Math.round(value * 10) / 10,
    },
    product_variations: { type: Array, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
)

productSchema.index({ product_name: "text", product_description: "text" })

productSchema.pre("save", function (next) {
  this.product_slug = slugify(this.product_name, { lower: true })
  next()
})

const clothingSchema = new Schema(
  {
    brand: { type: String, require: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: "shop" },
  },
  {
    collection: "clothes",
    timestamps: true,
  }
)

const electronicSchema = new Schema(
  {
    manufacturer: { type: String, require: true },
    model: String,
    color: String,
    product_shop: { type: Schema.Types.ObjectId, ref: "shop" },
  },
  {
    collection: "electronics",
    timestamps: true,
  }
)

const furnitureSchema = new Schema(
  {
    brand: { type: String, require: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: "shop" },
  },
  {
    collection: "furniture",
    timestamps: true,
  }
)

module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  clothing: model("clothing", clothingSchema),
  electronic: model("electronic", electronicSchema),
  furniture: model("furniture", furnitureSchema),
}
