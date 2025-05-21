import { z } from "zod";
import stringValidation from "../utils/zodValidationUtils/stringValidation";
const fileSchema = z.object({
  name: z.string(),
  type: z.string(),
  size: z.number(),
  data: z.union([z.string(), z.array(z.number())]), // base64 or Uint8Array as array
});

const messageSchema = z.object({
  chat: stringValidation("chat"),
  message: stringValidation("message", 1, 5000),
  files: z.array(fileSchema).optional(),
  readBy: z.array(z.string()).optional(),
});

export type TMessage = z.infer<typeof messageSchema>;
export default messageSchema;
