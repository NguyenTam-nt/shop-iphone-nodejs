"use strict"

const _ = require("lodash")
const crypto = require("crypto")
const { Types } = require("mongoose")

const getInToData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields)
}

const generateTokenKey = (size = 64) => {
  return crypto.randomBytes(size).toString("hex")
}

const getSelectSchema = (select = []) => {
  return Object.fromEntries(select.map((item) => [item, 1]))
}

const unGetSelectSchema = (select = []) => {
  return Object.fromEntries(select.map((item) => [item, 0]))
}

const removeUndefineObject = (object) => {
  Object.keys(object).forEach((key, index) => {
    if (object[key] === null) {
      delete object[key]
    }
  })

  return object
}

const updateNestedObjectParser = (obj) => {
  console.log({ obj })
  const final = {}

  Object.keys(obj).forEach((k) => {
    if (
      typeof obj[k] === "object" &&
      !Array.isArray(obj[k]) &&
      ![null, undefined].includes(obj[k])
    ) {
      const response = updateNestedObjectParser(obj[k])
      obj[k] = response
    } else {
      final[k] = obj[k]
    }
  })

  return final
}

const convertToObjectId = (id) => new Types.ObjectId(id)

module.exports = {
  getInToData,
  generateTokenKey,
  getSelectSchema,
  unGetSelectSchema,
  removeUndefineObject,
  updateNestedObjectParser,
  convertToObjectId,
}
