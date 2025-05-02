import { z } from "zod";
import stringValidation from "../utils/zodValidationUtils/stringValidation";

const verifyOtpSchema = z.object({
  email: stringValidation("email").email("Email must be a valid email address"),
  otp: stringValidation("otp", 6, 6),
});

export default verifyOtpSchema;
