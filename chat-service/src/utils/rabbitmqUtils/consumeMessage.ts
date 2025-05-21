import connectRabbitMQ from "../../config/connectToRabbitMq";
import GlobalError from "../GlobalError";
import httpStatusText from "../httpStatusText";

const consumeMessage = async (
  queueName: string,
  callBack: (message: any) => Promise<any>
) => {
  try {
    const channel = await connectRabbitMQ(queueName);
    let message = null;

    if (!channel) {
      const error = new GlobalError(
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
