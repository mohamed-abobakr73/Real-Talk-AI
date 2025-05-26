import { configDotenv } from "dotenv";
import webpush from "web-push";

configDotenv();

const PUBLIC_VAPID_KEY = process.env.PUBLIC_VAPID_KEY!;
const PRIVATE_VAPID_KEY = process.env.PRIVATE_VAPID_KEY!;

webpush.setVapidDetails(
  "mailto:mohamedabobakr04@gmail.com",
  PUBLIC_VAPID_KEY,
  PRIVATE_VAPID_KEY
);

export default webpush;
