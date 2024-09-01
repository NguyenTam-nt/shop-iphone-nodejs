const shopModel = require("../models/shop.model")
const bcrypt = require("bcrypt")
const KeyTokenService = require("./keyToken.service")
const { createTokenPair, verifyJWT } = require("../auth/authUtils")
const { getInToData, generateTokenKey } = require("../utils")
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response")
const { findByEmail } = require("./shop.service")

const roleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
}

class AccessService {
  static async handleRefreshTokenV2({ refreshToken, user, keyStore }) {
    const { userId, email } = user
    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyByUserId(userId)
      throw new ForbiddenError("Something waring happen!! Please login again.")
    }

    if (keyStore.refreshToken !== refreshToken) {
      throw new AuthFailureError()
    }

    const foundShop = await findByEmail({ email })

    if (!foundShop) throw new AuthFailureError()

    const tokens = await createTokenPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey
    )

    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    })

    return {
      user: { userId, email },
      tokens,
    }
  }

  static async handleRefreshToken(refreshToken) {
    const foundToken = await KeyTokenService.findByRefreshTokensUsed(
      refreshToken
    )
    if (foundToken) {
      const { userId, email } = verifyJWT(refreshToken, foundToken.privateKey)
      console.log({ userId, email })
      await KeyTokenService.deleteKeyByUserId(userId)
      throw new ForbiddenError("Something waring happen!! Please login again.")
    }

    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
    console.log({ holderToken })

    if (!holderToken) throw new AuthFailureError()

    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    )
    console.log("the user valid:", { userId, email })
    const foundShop = await findByEmail({ email })
    if (!foundShop) throw new AuthFailureError()

    const tokens = await createTokenPair(
      { userId, email },
      holderToken.publicKey,
      holderToken.privateKey
    )

    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    })

    return {
      user: { userId, email },
      tokens,
    }
  }

  static async logout({ keyStore }) {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id)
    return delKey
  }

  static async login({ email, password, refreshToken = null }) {
    const foundShop = await findByEmail({ email })
    if (!foundShop) throw new BadRequestError("Shop is not registered")
    const isValidPassword = await bcrypt.compare(password, foundShop.password)
    if (!isValidPassword) throw new AuthFailureError()

    const privateKey = generateTokenKey()
    const publicKey = generateTokenKey()

    const token = await createTokenPair(
      {
        userId: foundShop._id,
        email: foundShop.email,
      },
      publicKey,
      privateKey
    )

    await KeyTokenService.createKeyToken({
      refreshToken: token.refreshToken,
      privateKey,
      publicKey,
      userId: foundShop?._id,
    })

    return {
      code: 201,
      metadata: {
        shop: getInToData({
          fields: ["_id", "name", "email"],
          object: foundShop,
        }),
        token,
      },
    }
  }

  static async signUp({ name, email, password }) {
    const shop = await shopModel.findOne({ email }).lean()
    if (shop) {
      throw new BadRequestError("Error: Shop already registered")
    }
    const encodePass = await bcrypt.hash(password, 10)
    const newShop = await shopModel.create({
      name,
      password: encodePass,
      email,
      roles: [roleShop.SHOP],
    })
    if (newShop) {
      // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      //   privateKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      // })

      const privateKey = generateTokenKey()
      const publicKey = generateTokenKey()

      const publicKeyString = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      })

      if (!publicKeyString) {
        throw new BadRequestError("publicKeyString error")
      }

      const tokens = await createTokenPair(
        { userId: newShop._id, email: newShop.email },
        publicKey,
        privateKey
      )

      return {
        code: 201,
        metadata: {
          shop: getInToData({
            fields: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      }
    }

    return {
      code: 200,
      metadata: null,
    }
  }
}

module.exports = AccessService
