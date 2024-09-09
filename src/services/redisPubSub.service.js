const Redis = require("redis")

class RedisPubSubService {
  constructor() {
    ;(async () => {
      this.subscriber = Redis.createClient()
      this.publisher = Redis.createClient()
    })()
  }

  publish(channel, message) {
    return new Promise((resolve, reject) => {
      if (this.publisher)
        this.publisher.publish(channel, message, (error, reply) => {
          if (error) reject(error)
          else resolve(reply)
        })
    })
  }

  subscribe(channel, callback) {
    if (this.publisher) {
      this.subscriber.subscribe(channel)
      this.subscriber.on("message", (channelCalling, message) => {
        if (channel === channelCalling) callback(message)
      })
    }
  }

  //   async connect(callback) {
  //     await Promise.all([this.subscriber.connect(), this.publisher.connect()])
  //     callback()
  //   }
}

module.exports = new RedisPubSubService()
