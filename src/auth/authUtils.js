"use strict"

const JWT = require("jsonwebtoken")
const { asyncHandle } = require("../helpers/asyncHandler")
const { AuthFailureError, NotFoundError } = require("../core/error.response")
const KeyTokenService = require("../services/keyToken.service")

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESH_TOKEN: "x-rf-token",
}

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    })

    const refreshToken = JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    })

    return {
      accessToken,
      refreshToken,
    }
  } catch (error) {}
}

const authentication = asyncHandle(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID]
  if (!userId) throw new AuthFailureError("Invalid request")

  // 2
  const keyStore = await KeyTokenService.findByUserId({ userId })

  if (!keyStore) throw new NotFoundError("Not found KeyStore")

  const accessToken = req.headers[HEADER.AUTHORIZATION]

  if (!accessToken) throw new AuthFailureError("Invalid request")

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey)

    if (userId !== decodeUser?.userId)
      throw new AuthFailureError("Invalid User")

    req.keyStore = keyStore

    return next()
  } catch (error) {
    throw error
  }
})

const authenticationV2 = asyncHandle(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID]
  if (!userId) throw new AuthFailureError("Invalid request")

  // 2
  const keyStore = await KeyTokenService.findByUserId({ userId })

  if (!keyStore) throw new NotFoundError("Not found KeyStore")

  const refreshToken = req.headers[HEADER.REFRESH_TOKEN]
  if (refreshToken) {
    try {
      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey)

      if (userId !== decodeUser?.userId)
        throw new AuthFailureError("Invalid User")

      req.keyStore = keyStore
      req.user = decodeUser
      req.refreshToken = refreshToken

      return next()
    } catch (error) {
      throw error
    }
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION]

  if (!accessToken) throw new AuthFailureError("Invalid request")

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey)

    if (userId !== decodeUser?.userId)
      throw new AuthFailureError("Invalid User")
    req.user = decodeUser
    req.keyStore = keyStore

    return next()
  } catch (error) {
    throw error
  }
})

const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret)
}

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT,
  authenticationV2,
}
