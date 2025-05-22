import { z } from "zod";
import stringValidation from "../utils/zodValidationUtils/stringValidation";

const aiInputSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("summarizer"),
    data: z.object({
      conversation: stringValidation("conversation", 1, 10000),
    }),
  }),
  z.object({
    type: z.literal("suggestions"),
    data: z.object({
      message: stringValidation("message", 1, 1000),
    }),
  }),
  z.object({
    type: z.literal("translator"),
    data: z.object({
      sourceLang: stringValidation("source lang", 1, 50),
      targetLang: stringValidation("target lang", 1, 50),
      message: stringValidation("message", 1, 1000),
    }),
  }),
  z.object({
    type: z.literal("search"),
    data: z.object({
      conversation: stringValidation("conversation", 1, 10000),
      searchQuery: stringValidation("search query", 1, 1000),
    }),
  }),
]);

export default aiInputSchema;
