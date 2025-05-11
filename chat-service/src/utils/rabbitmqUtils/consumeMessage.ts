import connectRabbitMQ from "../../config/connectToRabbitMq";
import globalError from "../globalError";
import httpStatusText from "../httpStatusText";

const consumeMessage = async (queueName: string) => {
  try {
    const channel = await connectRabbitMQ(queueName);
    let message = null;

    if (!channel) {
      const error = globalError.create(
        "Failed to connect to RabbitMQ",
        500,
        httpStatusText.ERROR
      );
      throw error;
    }

    channel.consume(queueName, (msg) => {
      if (msg) {
        message = JSON.parse(msg.content.toString());
        channel.ack(msg);
      }
    });

    return message;
  } catch (error) {
    throw error;
  }
};

export default consumeMessage;
