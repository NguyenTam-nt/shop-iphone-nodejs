require("dotenv").config()

const express = require("express")
// const { compile } = require("morgan")
const morgan = require("morgan")
const { default: helmet } = require("helmet")
const compression = require("compression")
const { checkOverload } = require("./helpers/check.connect")

const app = express()

// init middleware

// morgan("combined")

// app.use(morgan("dev"))
// app.use(morgan("combined"))
// app.use(morgan("common"))
app.use(morgan("tiny"))
app.use(helmet())
app.use(compression())
// checkOverload()

// init database
require("./dbs/init.mongodb")

// init router

app.get("/", (req, res) => {
  const stringCompression = "Xin chao nhe"
  return res.status(200).json({
    message: "Hello",
    metadata: stringCompression.repeat(100000),
  })
})

// handling error

module.exports = app
