"use strict"

const express = require("express")
const { apiKey, permissions } = require("../auth/checkAuth")
const router = express.Router()

router.use(apiKey)
router.use(permissions("0000"))

router.use("/shop", require("./access"))
router.use("/product", require("./product"))
router.use("/cart", require("./cart"))
router.use("/comment", require("./comment"))
router.use("/upload", require("./upload"))

router.get("/check-status", (req, res, next) => {
  res.status(200).send({
    status: "ok",
    metaDta: {
      name: "Nguyễn Thanh Tâm",
      age: 25,
    },
  })
})

module.exports = router
