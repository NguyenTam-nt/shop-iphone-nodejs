"use strict"

const mongoose = require("mongoose")

const connectString = `mongodb://localhost:27017/shopIT`

mongoose
  .connect(connectString, {})
  .then(() => {
    console.log("Connect to mongodb successfully")
  })
  .catch(() => {
    console.log("Connect to mongodb false")
  })

module.exports = mongoose
