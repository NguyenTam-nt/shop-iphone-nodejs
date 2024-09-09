const amqp = require("amqplib")

const runConsumer = async () => {
  try {
    const connect = await amqp.connect("amqp://guest:12345@localhost")
    const channel = await connect.createChannel()

    const queueName = "test-topic"

    await channel.assertQueue(queueName, {
      durable: true,
    })

    channel.consume(
      queueName,
      (message) => {
        console.log("message ", message.content.toString())
      },
      {
        noAck: true,
      }
    )
  } catch (error) {}
}

runConsumer().catch(console.log)
