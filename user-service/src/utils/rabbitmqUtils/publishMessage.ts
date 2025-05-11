import connectRabbitMQ from "../../config/connectToRabbitMq";
import globalError from "../globalError";
import httpStatusText from "../httpStatusText";

const publishMessage = async (queueName: string, message: string) => {
  try {
    const channel = await connectRabbitMQ(queueName);

    if (!channel) {
      const error = globalError.create(
        "Failed to connect to RabbitMQ",
        500,
        httpStatusText.ERROR
      );
      throw error;
    }

    const sentMessage = channel.sendToQueue(queueName, Buffer.from(message));
    if (!sentMessage) {
      const error = globalError.create(
        "Failed to send message to RabbitMQ",
        500,
        httpStatusText.ERROR
      );
      throw error;
    }
  } catch (error) {
    throw error;
  }
};

export default publishMessage;
