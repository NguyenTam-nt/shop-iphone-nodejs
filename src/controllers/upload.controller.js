"use strict"
const { BadRequestError } = require("../core/error.response")
const { SuccessResponse } = require("../core/success.response")
const UploadService = require("../services/upload.service")

class UploadController {
  static async uploadImage(req, res, next) {
    const file = req.file
    if (!file) throw new BadRequestError("Please upload file image")
    new SuccessResponse({
      message: "upload message successfully",
      metaData: await UploadService.updateImage({ path: file.path }),
    }).send(res)
  }

  static async uploadFileS3(req, res, next) {
    const file = req.file
    if (!file) throw new BadRequestError("Please upload file image")
    new SuccessResponse({
      message: "upload message successfully",
      metaData: await UploadService.uploadS3Image({ file }),
    }).send(res)
  }
}

module.exports = UploadController
