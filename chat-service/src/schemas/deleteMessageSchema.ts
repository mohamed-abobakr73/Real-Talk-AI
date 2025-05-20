import { z } from "zod";
import stringValidation from "../utils/zodValidationUtils/stringValidation";

const deleteMessageSchema = z.object({
  chatId: stringValidation("chatId"),
  messageId: stringValidation("messageId"),
});

export default deleteMessageSchema;
