import webpush from "../config/webPushConfig";
import PushSubscriptionsModel from "../models/PushSubscriptionsModel";
import { TNotificationSubscribe } from "../schemas";

const savePushSubscriptionDataService = async (
  pushData: TNotificationSubscribe
) => {
  try {
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
