"use strict"

const { BadRequestError } = require("../core/error.response")
const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../models/product.model")
const { insertInventory } = require("../models/repositories/inventory.repo")
const {
  findDraftsForShop,
  publishProductByShop,
  findPublishForShop,
  unPublishProductByShop,
  searchProduct,
  findAllProduct,
  findProduct,
  updateProductById,
} = require("../models/repositories/product.repo")
const { removeUndefineObject, updateNestedObjectParser } = require("../utils")
const NotificationService = require("./notification.service")

class ProductFactory {
  static productRegistry = {}

  static registerProductType() {
    Object.entries(productListClass).forEach((item) => {
      ProductFactory.productRegistry[item?.[0]] = item?.[1]
    })
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type]
    if (!productClass) {
      throw new BadRequestError("Invalid Type of Product")
    }

    return new productClass(payload).createProduct()
  }

  static async updateProduct({ productId, payload, type }) {
    const productClass = ProductFactory.productRegistry[type]
    if (!productClass) {
      throw new BadRequestError("Invalid Type of Product")
    }

    return await new productClass(payload).updateProduct(productId)
  }

  //   static async createProduct(type, payload) {
  //     switch (type) {
  //       case "Electronics":
  //         return new Electronic(payload).createProduct()
  //       case "Clothing":
  //         return new Clothing(payload).createProduct()
  //       default:
  //         throw new BadRequestError("Invalid Type of Product")
  //     }
  //   }

  // PUT

  static async publishProductByShopService({ product_shop, product_id }) {
    return await publishProductByShop({ product_id, product_shop })
  }

  static async unPublishProductByShopService({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_id, product_shop })
  }

  static async findDraftsForShopService(product_shop, limit = 50, skip = 0) {
    const query = { product_shop, isDraft: true }
    return await findDraftsForShop({ query, limit, skip })
  }

  static async findPublishForShopService(product_shop, limit = 50, skip = 0) {
    const query = { product_shop, isPublished: true }
    return await findPublishForShop({ query, limit, skip })
  }

  static async searchProductService(query) {
    return await searchProduct(query)
  }

  static async findAllProductService({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
  }) {
    return await findAllProduct({
      limit,
      select: ["product_name", "product_price", "_id", "product_thumb"],
      sort,
      filter,
      page,
    })
  }

  static async findProductService({ product_id }) {
    return await findProduct({ product_id, unSelects: ["__v"] })
  }
}

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name
    this.product_thumb = product_thumb
    this.product_description = product_description
    this.product_price = product_price
    this.product_quantity = product_quantity
    this.product_type = product_type
    this.product_shop = product_shop
    this.product_attributes = product_attributes
  }

  async createProduct(product_id) {
    const newProduct = await product.create({
      ...this,
      _id: product_id,
    })

    NotificationService.pushNotification({
      type: "SHOP-001",
      senderId: this.product_shop,
      receiverId: 1,
      options: {
        product_name: this.product_name,
        product_price: this.product_price,
      },
    })

    if (newProduct) {
      await insertInventory({
        productId: newProduct._id,
        shopId: this.product_shop,
        stock: this.product_quantity,
      })
    }

    return newProduct
  }

  async updateProduct(productId, payload) {
    return await updateProductById({ productId, payload, model: product })
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    })
    if (!newClothing) throw new BadRequestError("create new Clothing error")

    const newProduct = await super.createProduct(newClothing._id)
    if (!newProduct) throw new BadRequestError("create new Product error")

    return newProduct
  }

  async updateProduct(productId) {
    const objectParams = removeUndefineObject(this)
    if (objectParams.product_attributes) {
      await updateProductById({
        productId,
        payload: updateNestedObjectParser(objectParams.product_attributes),
        model: clothing,
      })
    }

    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objectParams)
    )
    return updateProduct
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    })
    if (!newElectronic) throw new BadRequestError("create new Electronic error")

    const newProduct = await super.createProduct(newElectronic._id)
    if (!newProduct) throw new BadRequestError("create new Product error")

    return newProduct
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    })
    if (!newFurniture) throw new BadRequestError("create new Furniture error")

    const newProduct = await super.createProduct(newFurniture._id)
    if (!newProduct) throw new BadRequestError("create new Product error")

    return newProduct
  }
}

const productListClass = {
  Electronics: Electronic,
  Clothing: Clothing,
  Furniture: Furniture,
}

ProductFactory.registerProductType()

module.exports = ProductFactory
