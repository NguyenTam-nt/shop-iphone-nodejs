"use strict"

const express = require("express")
const { apiKey, permissions } = require("../auth/checkAuth")
const router = express.Router()

router.use(apiKey)
router.use(permissions("0000"))

router.use("/shop", require("./access"))
router.use("/product", require("./product"))
router.use("/cart", require("./cart"))

module.exports = router
