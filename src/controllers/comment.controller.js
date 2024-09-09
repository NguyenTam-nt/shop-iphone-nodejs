"use strict"

const { SuccessResponse } = require("../core/success.response")
const CommentService = require("../services/comment.service")

class CommentController {
  createComment = async (req, res, next) => {
    new SuccessResponse({
      message: "Add to Cart Successfully",
      metaData: await CommentService.createComment(req.body),
    }).send(res)
  }

  getByParentId = async (req, res, next) => {
    new SuccessResponse({
      message: "Add to Cart Successfully",
      metaData: await CommentService.getCommentByParentId(req.query),
    }).send(res)
  }

  deleteComment = async (req, res, next) => {
    new SuccessResponse({
      message: "Delete Comment Successfully",
      metaData: await CommentService.deleteComment(req.body),
    }).send(res)
  }
}

module.exports = new CommentController()
