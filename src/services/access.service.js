const shopModel = require("../models/shop.model")
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const KeyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const { getInToData } = require("../utils")

const roleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
}

class AccessService {
  static async signUp({ name, email, password }) {
    try {
      // step1
      const shop = await shopModel.findOne({ email }).lean()
      if (shop) {
        return {
          code: "xxx",
          message: "this shop really registered",
        }
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

        const privateKey = crypto.randomBytes(64).toString("hex")
        const publicKey = crypto.randomBytes(64).toString("hex")

        const publicKeyString = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey,
        })

        if (!publicKeyString) {
          return {
            code: "xxx",
            message: "publicKeyString error",
          }
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
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
      }
    }
  }
}

module.exports = AccessService
