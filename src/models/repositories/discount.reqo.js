const {
  convertToObjectId,
  unGetSelectSchema,
  getSelectSchema,
} = require("../../utils")
const { discount } = require("../discount.model")

const findDiscountByCodeAndShop = async (code, shopId) => {
  return await discount.findOne({
    discount_code: code,
    discount_shop_id: convertToObjectId(shopId),
  }).lean
}

const findAllDiscountCodeUnSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  unSelect: [],
  model,
  filter,
}) => {
  const skip = (page - 1) * limit
  const query = sort === "ctime" ? { _id: -1 } : { _id: 1 }
  return await model
    .find(filter)
    .sort(query)
    .skip(skip)
    .limit(limit)
    .select(unGetSelectSchema(unSelect))
    .lean()
}

const findAllDiscountCode = async ({
  limit = 50,
  page = 1,
  filter,
  select,
  sort,
  model,
}) => {
  const skip = (page - 1) * limit
  const query = sort === "ctime" ? { _id: -1 } : { _id: 1 }

  const data = await model
    .find(filter)
    .sort(query)
    .skip(skip)
    .limit(limit)
    .select(getSelectSchema(select))
    .lean()

  return data
}

module.exports = {
  findDiscountByCodeAndShop,
  findAllDiscountCodeUnSelect,
  findAllDiscountCode,
}
