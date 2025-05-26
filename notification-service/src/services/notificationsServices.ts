import webpush from "../config/webPushConfig";
import PushSubscriptionsModel from "../models/PushSubscriptionsModel";
import { TNotificationSubscribe } from "../schemas";
import GlobalError from "../utils/GlobalError";
import httpStatusText from "../utils/httpStatusText";
import chatsServices from "./chatsServices";

const getSubscriptionsByUserIdService = async (userId: string) => {
  try {
    const subscription = await PushSubscriptionsModel.find({
      userId,
    }).select("endpoint keys -_id");
    return subscription;
  } catch (error) {
    throw error;
  }
};

const savePushSubscriptionDataService = async (
  pushData: TNotificationSubscribe & { userId: string }
) => {
  try {
    const { userId } = pushData;
    const subscription = await PushSubscriptionsModel.findOne({
      userId,
      endpoint: pushData.endpoint,
    });

    if (subscription) {
      return subscription;
    }

    const pushSubscription = await PushSubscriptionsModel.create(pushData);
    return pushSubscription;
  } catch (error) {
    throw error;
  }
};

const sendNotificationService = async (subscription: any, payload: any) => {
  try {
    const sentNotification = await webpush.sendNotification(
      subscription,
      JSON.stringify(payload)
    );
  } catch (error: any) {
    if (error.statusCode === 410 || error.statusCode === 404) {
      await PushSubscriptionsModel.deleteOne({
        endpoint: subscription.endpoint,
      });
    }
    throw error;
  }
};

const sentChatMessageNotificationService = async (payload: any) => {
  try {
    const { senderId, chatId, username, message, files } = payload;

    const chat = await chatsServices.getChatByIdService(chatId);

    if (!chat) {
      const error = new GlobalError(
        "Chat not found",
        404,
        httpStatusText.NOT_FOUND
      );
      throw error;
    }

    const chatMessagePayload = {
      username,
      message,
      files,
    };

    const chatUsers = chat.users.filter((user) => user.userId !== senderId);

    for (const user of chatUsers) {
      const subscriptions = await getSubscriptionsByUserIdService(user.userId);
      subscriptions.forEach(
        async (sub) => await sendNotificationService(sub, chatMessagePayload)
      );
    }

    return;
  } catch (error) {
    throw error;
  }
};

export default {
  savePushSubscriptionDataService,
  sendNotificationService,
  sentChatMessageNotificationService,
};
