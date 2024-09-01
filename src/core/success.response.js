"use strict"

const StatusCode = {
  OK: 200,
  CREATE: 201,
}

const ReasonStatusCode = {
  OK: "Success",
  CREATE: "Create",
}

class SuccessResponse {
  constructor({
    message,
    statusCode = StatusCode.OK,
    reasonStatus = ReasonStatusCode.OK,
    metaData = {},
  }) {
    this.message = message
    this.statusCode = statusCode
    this.reasonStatus = reasonStatus
    this.metaData = metaData
  }

  send(res, headers = {}) {
    return res.status(this.statusCode).json(this)
  }
}

class OKResponse extends SuccessResponse {
  constructor({ message, metaData }) {
    super({ message, metaData })
  }
}

class CreatedResponse extends SuccessResponse {
  constructor({
    message,
    metaData,
    statusCode = StatusCode.CREATE,
    reasonStatus = ReasonStatusCode.CREATE,
    options,
  }) {
    super({ message, metaData, statusCode, reasonStatus })
    this.options = options
  }
}

module.exports = {
  OKResponse,
  CreatedResponse,
  SuccessResponse,
}
