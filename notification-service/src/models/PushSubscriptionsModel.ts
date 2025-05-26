import { model, Schema } from "mongoose";
import { TNotificationSubscribe } from "../schemas";

const pushSubscriptionsSchema = new Schema<
  TNotificationSubscribe & { userId: string }
>(
  {
    userId: { type: String, required: true },
    endpoint: { type: String, required: true },
    keys: {
      p256dh: { type: String, required: true },
      auth: { type: String, required: true },
    },
  },
  { timestamps: true }
);

const PushSubscriptionsModel = model(
  "PushSubscriptions",
  pushSubscriptionsSchema
);
export default PushSubscriptionsModel;
