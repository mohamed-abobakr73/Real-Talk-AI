import { z } from "zod";
import stringValidation from "../utils/zodValidationUtils/stringValidation";

const chatIdSchema = z.object({
  chatId: stringValidation("chatId"),
});

export default chatIdSchema;
