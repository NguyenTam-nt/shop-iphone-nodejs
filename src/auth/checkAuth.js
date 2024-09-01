"use strict"

const { findById } = require("../services/apiKey.service")

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
}

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString()
    if (!key) {
      return res.status(403).json({
        message: "Forbidden Error",
      })
    }
    const obj = await findById(key)
    if (!obj) {
      return res.status(403).json({
        message: "Forbidden Error",
      })
    }

    req.objKey = obj
    return next()
  } catch (error) {}
}

const permissions = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: "permission denied",
      })
    }

    if (!req.objKey.permissions.includes(permission)) {
      return res.status(403).json({
        message: "permission denied",
      })
    }
    return next()
  }
}

module.exports = {
  apiKey,
  permissions,
}
