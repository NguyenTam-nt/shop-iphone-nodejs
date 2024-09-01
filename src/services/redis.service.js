"use strict"
const redis = require("redis")
const { promisify } = require("util")
const {
  reservationInventory,
} = require("../models/repositories/inventory.repo")

const redisClient = redis.createClient()

const pexprire = promisify(redisClient.persist).bind(redisClient)

const setnxAsync = promisify(redisClient.setEx).bind(redisClient)

const acquiredLock = async (productId, quantity, cartId) => {
  const key = `lock_v2024_${productId}`

  const retryTimes = 10
  const expireTime = 3000

  for (let index = 0; index < retryTimes; index++) {
    const result = await setnxAsync(key, expireTime)

    if (result === 1) {
      // thao tác với inventory
      const isReservation = await reservationInventory({
        productId,
        cartId,
        quantity,
      })

      if (isReservation.modifiedCount) {
        await pexprire(key, expireTime)
        return key
      }

      return null
    } else {
      await new Promise((resolve) => {
        setTimeout(resolve, 50)
      })
    }
  }
}

const releaseLock = async (keyLock) => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient)

  return await delAsyncKey(keyLock)
}

module.exports = {
  acquiredLock,
  releaseLock,
}
