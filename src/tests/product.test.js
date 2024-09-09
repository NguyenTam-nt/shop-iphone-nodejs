const redisPubSubService = require("../services/redisPubSub.service")

class ProductTest {
  purchaseProduct(productId, quantity) {
    const order = {
      productId,
      quantity,
    }

    redisPubSubService.publish("product:001", JSON.stringify(order))
  }
}

module.exports = new ProductTest()
