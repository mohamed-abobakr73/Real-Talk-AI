import { z } from "zod";
import stringValidation from "../utils/zodValidationUtils/stringValidation";

const typingIndicatorSchema = z.object({
  chatId: stringValidation("chatId"),
});

export default typingIndicatorSchema;
