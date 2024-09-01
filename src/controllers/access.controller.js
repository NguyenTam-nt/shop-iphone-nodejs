"use strict"

const { CreatedResponse, SuccessResponse } = require("../core/success.response")
const AccessService = require("../services/access.service")

class AccessController {
  handleRefreshToken = async (req, res, next) => {
    //v1
    // new SuccessResponse({
    //   message: "Refresh Token successfully!",
    //   metaData: await AccessService.handleRefreshToken(req.body?.refreshToken),
    // }).send(res)
    // v2 fixed, no need to check accessToken

    new SuccessResponse({
      message: "Refresh Token successfully!",
      metaData: await AccessService.handleRefreshTokenV2({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res)
  }

  async logout(req, res, next) {
    new SuccessResponse({
      metaData: await AccessService.logout({ keyStore: req.keyStore }),
      message: "Logout successfully!",
    }).send(res)
  }

  async login(req, res, next) {
    new SuccessResponse({
      metaData: await AccessService.login(req.body),
    }).send(res)
  }

  async signUp(req, res, next) {
    new CreatedResponse({
      metaData: await AccessService.signUp(req.body),
      options: {
        limit: 10,
      },
    }).send(res)
  }
}

module.exports = new AccessController()
