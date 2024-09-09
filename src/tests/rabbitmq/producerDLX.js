const amqp = require("amqplib")

const message = `The taki shop just add new product ${Date.now()}`

const runProducer = async () => {
  try {
    const connect = await amqp.connect("amqp://guest:12345@localhost")
    const channel = await connect.createChannel()

    const notificationExchange = "notificationEx"

    const notifyQueue = "notificationQueueProcess"
    const notificationExchangeDLX = "notificationExchangeDLX"
    const notificationRoutingKeyDLX = "notificationRoutingKeyDLX"

    await channel.assertExchange(notificationExchange, "direct", {
      durable: true,
    })

    const queueResult = await channel.assertQueue(notifyQueue, {
      exclusive: false,
      deadLetterExchange: notificationExchangeDLX,
      deadLetterRoutingKey: notificationRoutingKeyDLX,
    })

    await channel.bindQueue(queueResult.queue, notificationExchange)

    await channel.sendToQueue(queueResult.queue, Buffer.from(message), {
      expiration: "10000",
    })
    console.log("published the message ", message)

    setTimeout(async () => {
      await connect.close()
      process.exit(0)
    }, 500)
  } catch (error) {}
}

runProducer().catch(console.log)
