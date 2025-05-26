import webpush from "../config/webPushConfig";

const sendNotificationService = async (subscription: any, payload: any) => {
  try {
    const sentNotification = await webpush.sendNotification(
      subscription,
      JSON.stringify(payload)
    );
    console.log(sentNotification);
  } catch (error) {
    throw error;
  }
};

export default {
  sendNotificationService,
};
