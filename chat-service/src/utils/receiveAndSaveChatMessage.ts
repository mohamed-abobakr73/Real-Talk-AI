import messagesServices from "../services/messagesServices";

const receiveAndSaveChatMessage = async (messageData: any) => {
  try {
    const savedMessage = await messagesServices.createMessageService(
      messageData
    );
    console.log("📨 Message received:", savedMessage);
    return savedMessage;
  } catch (error) {
    throw error;
  }
};

export default receiveAndSaveChatMessage;
