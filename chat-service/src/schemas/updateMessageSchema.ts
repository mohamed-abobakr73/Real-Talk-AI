import { z } from "zod";
import stringValidation from "../utils/zodValidationUtils/stringValidation";

const updateMessageSchema = z.object({
  chatId: stringValidation("chatId"),
  messageId: stringValidation("messageId"),
  newMessageContent: stringValidation("newMessageContent", 1, 5000),
});

export default updateMessageSchema;
