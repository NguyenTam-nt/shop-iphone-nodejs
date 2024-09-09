const amqp = require("amqplib")

const message = `The taki shop just add new product ${Date.now()}`

const runProducer = async () => {
  try {
    const connect = await amqp.connect("amqp://guest:12345@localhost")
    const channel = await connect.createChannel()

    const queueName = "test-topic"

    await channel.assertQueue(queueName, {
      durable: true,
    })

    channel.sendToQueue(queueName, Buffer.from(message))
    setTimeout(async () => {
      await connect.close()
      process.exit(0)
    }, 500)
  } catch (error) {}
}

runProducer().catch(console.log)
