"use strict"

const { find } = require("lodash")
const { BadRequestError, NotFoundError } = require("../core/error.response")
const { discount } = require("../models/discount.model")
const {
  findDiscountByCodeAndShop,
  findAllDiscountCodeUnSelect,
} = require("../models/repositories/discount.reqo")
const { findAllProduct } = require("../models/repositories/product.repo")
const { convertToObjectId } = require("../utils")

class DiscountService {
  static createDiscountCode = async (payload) => {
    const {
      code,
      startDate,
      endDate,
      status,
      shopId,
      minOrderValue,
      productIds = [],
      appliesTo,
      description,
      type,
      value,
      maxValue,
      maxUse,
      usesCount,
      maxUserUse,
      name,
    } = payload

    if (new Date() < new Date(startDate) || new Date() > new Date(endDate)) {
      throw new BadRequestError("Discount code has expired.")
    }

    if (new Date(startDate) >= new Date(endDate)) {
      throw new BadRequestError(
        "Discount Start Date must before Discount End Date."
      )
    }

    const foundDiscount = await findDiscountByCodeAndShop(code, shopId)

    if (foundDiscount && foundDiscount.discount_applies_to) {
      throw new BadRequestError("Discount exists.")
    }

    const newDiscount = await discount.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_code: code,
      discount_start_date: startDate,
      discount_end_date: endDate,
      discount_max_use: maxUse,
      discount_uses_count: usesCount,
      discount_users_used: usesCount,
      discount_users_max_use: maxUserUse,
      discount_min_order_value: minOrderValue,
      discount_shop_id: convertToObjectId(shopId),
      discount_status: status,
      discount_applies_to: appliesTo,
      discount_product_ids: appliesTo === "all" ? [] : productIds,
      discount_max_value: maxValue,
    })

    return newDiscount
  }

  static updateDiscountCode = async () => {}

  static getAllDiscountCodeWithProduct = async ({
    code,
    shopId,
    userId,
    limit,
    page,
  }) => {
    const foundDiscount = await findDiscountByCodeAndShop(code, shopId)

    if (!foundDiscount || !foundDiscount.discount_status) {
      throw new NotFoundError("Discount not exists")
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount

    let products

    if (discount_applies_to === "all") {
      products = await findAllProduct({
        limit,
        page,
        filter: {
          product_shop: convertToObjectId(shopId),
          isPublished: true,
        },
        sort: "ctime",
        select: ["product_name"],
      })
    }

    if (discount_applies_to === "specific") {
      products = await findAllProduct({
        limit,
        page,
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        sort: "ctime",
        select: ["product_name"],
      })
    }

    return products
  }

  static getAllDiscountCodeByShop = async ({ limit, page, shopId }) => {
    const discounts = await findAllDiscountCodeUnSelect({
      limit,
      page,
      filter: {
        discount_shop_id: convertToObjectId(shopId),
        discount_status: true,
      },
      unSelect: ["__v", "discount_shop_id"],
      model: discount,
    })

    return discounts
  }

  static getDiscountAmount = async ({ code, userId, shopId, products }) => {
    const foundDiscount = await findDiscountByCodeAndShop(code, shopId)

    if (!foundDiscount) {
      throw new NotFoundError("Discount doesn't exists!")
    }

    const {
      discount_status,
      discount_max_use,
      discount_start_date,
      discount_end_date,
      discount_min_order_value,
      discount_users_used,
      discount_users_max_use,
      discount_type,
      discount_value,
    } = foundDiscount

    if (!discount_status) throw new NotFoundError("Discount expired!")

    if (discount_max_use === 0) throw new NotFoundError("Discount is out!")

    if (
      new Date() < new Date(discount_start_date) ||
      new Date() > new Date(discount_end_date)
    )
      throw new NotFoundError("Discount expired!")

    let totalOrder = 0

    if (discount_min_order_value) {
      totalOrder = products.reduce((acc, product) => {
        return acc + product.quantity * product.price
      }, 0)

      if (totalOrder < discount_min_order_value) {
        throw new NotFoundError(
          `the discount requires a minium order value of ${discount_min_order_value}`
        )
      }

      if (discount_users_max_use > 0) {
        const userUseDiscount = discount_users_used.find(
          (user) => user.userId === userId
        )

        if (
          userUseDiscount &&
          userUseDiscount.count >= discount_users_max_use
        ) {
          throw new NotFoundError(
            `the discount requires a max user use of ${discount_users_max_use}`
          )
        }

        const amount =
          discount_type === "fixed_amount"
            ? discount_value
            : totalOrder * (discount_value / 100)
      }

      return {
        totalOrder,
        discount: amount,
        totalFinal: totalOrder - amount,
      }
    }
  }

  static deleteDiscountCode = async ({ shopId, code }) => {
    const deleted = await discount.findOneAndDelete({
      discount_code: code,
      discount_shop_id: convertToObjectId(shopId),
    })

    return deleted
  }

  static cancelDiscountCode = async ({ code, shopId, userId }) => {
    const foundDiscount = await findDiscountByCodeAndShop(code, shopId)

    if (!foundDiscount) throw new NotFoundError("Discount doesn't exists!")

    const result = await discount.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId,
      },
      $inc: {
        discount_max_use: 1,
        discount_uses_count: -1,
      },
    })
    return result
  }
}

module.exports = DiscountService
