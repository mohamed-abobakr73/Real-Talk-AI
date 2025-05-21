import { z } from "zod";
import stringValidation from "../utils/zodValidationUtils/stringValidation";

const messageSchema = z.object({
  chat: stringValidation("chat"),
  message: stringValidation("message", 1, 5000),
  files: z.array(z.string()).optional(),
  readBy: z.array(z.string()).optional(),
});

export type TMessage = z.infer<typeof messageSchema>;
export default messageSchema;
