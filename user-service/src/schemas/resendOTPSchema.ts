import { z } from "zod";

const resendOtpSchema = z.object({
  email: z.string().email("Email must be a valid email address"),
});

export default resendOtpSchema;
