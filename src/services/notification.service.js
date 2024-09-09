"use strict"

const { notification } = require("../models/notification.model")

class NotificationService {
  static async pushNotification({
    type = "SHOP-001",
    senderId = 1,
    receiverId = 1,
    options = {},
  }) {
    let notify_content
    if (type === "SHOP-001") {
      notify_content = "@@@ vừa mới thêm 1 sản phẩm: @@@@"
    } else if (type === "SHOP-002") {
      notify_content = "@@@ vừa mới thêm 1 voucher: @@@@"
    }

    const notify = await notification.create({
      notify_type: type,
      notify_content: notification,
      notify_sender_id: senderId,
      notify_receiver_id: receiverId,
      notify_option: options,
    })

    return notify
  }
}

module.exports = NotificationService
