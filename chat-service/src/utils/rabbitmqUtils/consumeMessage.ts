import connectRabbitMQ from "../../config/connectToRabbitMq";
import globalError from "../globalError";
import httpStatusText from "../httpStatusText";

const consumeMessage = async (
  queueName: string,
  callBack: (message: any) => Promise<any>
) => {
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

    channel.consume(queueName, async (msg) => {
      if (msg) {
        message = await JSON.parse(msg.content.toString());
        await callBack(message);
        console.log(message);
        channel.ack(msg);
      }
    });
  } catch (error) {
    throw error;
  }
};

export default consumeMessage;
