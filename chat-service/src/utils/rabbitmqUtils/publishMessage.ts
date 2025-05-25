import connectRabbitMQ from "../../config/connectToRabbitMq";
import GlobalError from "../GlobalError";
import httpStatusText from "../httpStatusText";

const publishMessage = async (queueName: string, message: string) => {
  try {
    const channel = await connectRabbitMQ(queueName);

    if (!channel) {
      const error = new GlobalError(
        "Failed to connect to RabbitMQ",
        500,
        httpStatusText.ERROR
      );
      throw error;
    }

    const sentMessage = channel.sendToQueue(queueName, Buffer.from(message));
    if (!sentMessage) {
      const error = new GlobalError(
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
