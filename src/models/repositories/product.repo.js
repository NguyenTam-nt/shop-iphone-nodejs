"use strict"

const { Types } = require("mongoose")
const { product, electronic, clothing, furniture } = require("../product.model")
const { getSelectSchema, unGetSelectSchema } = require("../../utils")

const findDraftsForShop = async (body) => {
  return await queryProduct(body)
}

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop,
    _id: product_id,
  })

  if (!foundShop) return null

  foundShop.isDraft = false
  foundShop.isPublished = true
  const { modifiedCount } = await foundShop.updateOne(foundShop)
  return modifiedCount
}

const unPublishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop,
    _id: product_id,
  })

  if (!foundShop) return null

  foundShop.isDraft = true
  foundShop.isPublished = false
  const { modifiedCount } = await foundShop.updateOne(foundShop)
  return modifiedCount
}

const findPublishForShop = async (body) => {
  return await queryProduct(body)
}

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email, -_id")
    .sort({
      updateAt: -1,
    })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
}

const searchProduct = async ({ keySearch }) => {
  const querySearch = new RegExp(keySearch)
  const resultProducts = product
    .find(
      {
        isPublished: true,
        $text: { $search: querySearch },
      },
      {
        score: { $meta: "textScore" },
      }
    )
    .sort({
      score: { $meta: "textScore" },
    })
    .lean()

  return resultProducts
}

const findAllProduct = async ({
  limit = 50,
  page = 1,
  filter,
  select,
  sort,
}) => {
  const skip = (page - 1) * limit
  const query = sort === "ctime" ? { _id: -1 } : { _id: 1 }

  const data = await product
    .find(filter)
    .sort(query)
    .skip(skip)
    .limit(limit)
    .select(getSelectSchema(select))
    .lean()

  return data
}

const findProduct = async ({ product_id, unSelects }) => {
  return await product.findById(product_id).select(unGetSelectSchema(unSelects))
}

const updateProductById = async ({
  productId,
  payload,
  model,
  isNew = true,
}) => {
  return await model.findByIdAndUpdate(productId, payload, {
    new: isNew,
  })
}

const checkProductByServer = async (products) => {
  return await Promise.all(
    products.map(async (product) => {
      const foundProduct = await findProduct(product.productId)
      if (foundProduct) {
        return {
          price: foundProduct.product_price,
          quantity: products.quantity,
          productId: products.productId,
        }
      }
    })
  )
}

module.exports = {
  findDraftsForShop,
  publishProductByShop,
  findPublishForShop,
  unPublishProductByShop,
  searchProduct,
  findAllProduct,
  findProduct,
  updateProductById,
  checkProductByServer,
}
