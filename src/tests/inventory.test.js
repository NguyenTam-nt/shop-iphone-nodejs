const redisPubSubService = require("../services/redisPubSub.service")

class InventoryTest {
  constructor() {
    redisPubSubService.subscribe("product:001", (data) => {
      InventoryTest.updateInventory(JSON.parse(data))
    })
  }

  static updateInventory({ productId, quantity }) {
    console.log("data from channel product:001", productId, quantity)
  }
}

module.exports = new InventoryTest()
