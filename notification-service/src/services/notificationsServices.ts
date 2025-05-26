import webpush from "../config/webPushConfig";
import PushSubscriptionsModel from "../models/PushSubscriptionsModel";
import { TNotificationSubscribe } from "../schemas";

const getSubscriptionByUserIdService = async (userId: string) => {
  try {
    const subscription = await PushSubscriptionsModel.findOne({ userId });
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
  } catch (error) {
    throw error;
  }
};

export default { savePushSubscriptionDataService, sendNotificationService };
