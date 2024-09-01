"use strict"

const apiKeyModel = require("../models/apiKey.model")

const findById = async (key) => {
  // const a = await apiKeyModel.create({
  //   key: crypto.randomBytes(40).toString("hex"),
  //   permissions: ["0000"],
  // })
  // console.log(a)
  const objKey = await apiKeyModel.findOne({ key, status: true }).lean()
  return objKey
}

module.exports = {
  findById,
}
