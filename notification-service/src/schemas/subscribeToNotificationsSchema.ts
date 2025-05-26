import { z } from "zod";
import stringValidation from "../utils/zodValidationUtils/stringValidation";

const subscribeToNotificationsSchema = z.object({
  endpoint: stringValidation("endpoint", 1),
  keys: z.object({
    p256dh: stringValidation("p256dh", 1),
    auth: stringValidation('1"auth"', 1),
  }),
});

export default subscribeToNotificationsSchema;
