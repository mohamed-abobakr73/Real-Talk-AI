import amqp from "amqplib";

const connectRabbitMQ = async (queueName: string) => {
  try {
    const RABBITMQ_URL = process.env.RABBITMQ_URL!;
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName);
    console.log("Connected to RabbitMQ");
    return channel;
  } catch (error) {
    console.error("Error connecting to RabbitMQ:", error);
  }
};

export default connectRabbitMQ;
