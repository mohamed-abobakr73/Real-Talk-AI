import { z } from "zod";

const emailSchema = z.object({
  email: z.string().email("Email must be a valid email address"),
});

export default emailSchema;
