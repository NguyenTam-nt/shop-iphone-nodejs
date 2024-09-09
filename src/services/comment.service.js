const { NotFoundError } = require("../core/error.response")
const { comment } = require("../models/comment.model")
const { findProduct } = require("../models/repositories/product.repo")
const { convertToObjectId } = require("../utils")

class CommentService {
  static async createComment({ productId, userId, content, parentId = null }) {
    const newComment = new comment({
      comment_content: content,
      comment_user_id: userId,
      comment_product_id: productId,
      comment_parent_id: parentId,
    })

    let rightValue
    if (parentId) {
      const parentComment = await comment.findById(parentId).lean()

      if (!parentComment) throw new NotFoundError("parent comment not found")

      rightValue = parentComment.comment_right

      await comment.updateMany(
        {
          comment_product_id: convertToObjectId(productId),
          comment_right: { $gte: rightValue },
        },
        {
          $inc: {
            comment_right: 2,
          },
        }
      )

      await comment.updateMany(
        {
          comment_product_id: convertToObjectId(productId),
          comment_left: { $gt: rightValue },
        },
        {
          $inc: {
            comment_left: 2,
          },
        }
      )
    } else {
      const maxRightValue = await comment.findOne(
        {
          comment_product_id: convertToObjectId(productId),
        },
        "comment_right",
        { sort: { comment_right: -1 } }
      )

      if (maxRightValue) {
        rightValue = maxRightValue + 1
      } else {
        rightValue = 1
      }
    }

    newComment.comment_left = rightValue
    newComment.comment_right = rightValue + 1
    await newComment.save()
    return newComment
  }

  static async getCommentByParentId({ productId, parentId = null }) {
    console.log(productId, parentId)
    if (parentId) {
      const parentComment = await comment.findById(parentId)
      if (!parentComment) throw new NotFoundError("Parent comment is not found")
      return await comment
        .find({
          comment_product_id: convertToObjectId(productId),
          comment_parent_id: convertToObjectId(parentId),
          comment_left: { $gt: parentComment.comment_left },
          comment_right: { $lte: parentComment.comment_right },
        })
        .select({
          comment_content: 1,
          comment_left: 1,
          comment_right: 1,
          comment_parent_id: 1,
        })
        .sort({
          comment_left: 1,
        })
    }

    return await comment
      .find({
        comment_product_id: convertToObjectId(productId),
        comment_parent_id: parentId,
      })
      .select({
        comment_content: 1,
        comment_left: 1,
        comment_right: 1,
        comment_parent_id: 1,
      })
      .sort({
        comment_left: 1,
      })
  }

  static async deleteComment({ productId, commentId }) {
    const foundProduct = await findProduct({ product_id: productId })

    if (!foundProduct) throw new NotFoundError("The product is not found")

    const currentComment = await comment.findById(commentId)
    if (!currentComment) throw new NotFoundError("The comment is not found")

    const leftValue = currentComment.comment_left
    const rightValue = currentComment.comment_right

    const width = rightValue - leftValue + 1

    await comment.deleteMany({
      comment_product_id: convertToObjectId(productId),
      comment_left: { $gte: leftValue, $lte: rightValue },
    })

    await comment.updateMany(
      {
        comment_product_id: convertToObjectId(productId),
        comment_right: { $gt: rightValue },
      },
      {
        $inc: {
          comment_right: -width,
        },
      }
    )

    await comment.updateMany(
      {
        comment_product_id: convertToObjectId(productId),
        comment_left: { $gt: rightValue },
      },
      {
        $inc: {
          comment_left: -width,
        },
      }
    )

    return true
  }
}

module.exports = CommentService
