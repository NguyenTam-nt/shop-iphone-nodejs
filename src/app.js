require("dotenv").config()

const express = require("express")
// const { compile } = require("morgan")
const morgan = require("morgan")
const { default: helmet } = require("helmet")
const compression = require("compression")
const { checkOverload } = require("./helpers/check.connect")
// const productTest = require("./tests/product.test")
// const redisPubSubService = require("./services/redisPubSub.service")

const app = express()

// init middleware

// morgan("combined")
// require("./tests/inventory.test")
// productTest.purchaseProduct("#100102092024", 80)

app.use(morgan("dev"))
app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  })
)
// app.use(morgan("combined"))
// app.use(morgan("common"))
// app.use(morgan("tiny"))
app.use(helmet())
app.use(compression())
// checkOverload()

// init database
require("./dbs/init.mongodb")

// init router
app.use("/v1/api", require("./routers"))

// handling error

app.use((req, res, next) => {
  const error = new Error("Not Found")
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  const status = error.status || 500
  error.status = 404
  return res.status(status).json({
    status: "code",
    code: status,
    stack: error,
    message: error.message || "Internal Server Error",
  })
})

module.exports = app
