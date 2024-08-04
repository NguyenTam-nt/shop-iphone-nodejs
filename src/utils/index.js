"use strict"

const _ = require("lodash")

const getInToData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields)
}

module.exports = {
  getInToData,
}
