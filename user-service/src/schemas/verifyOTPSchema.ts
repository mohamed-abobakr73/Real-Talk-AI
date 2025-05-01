import { z } from "zod";
import stringValidation from "../utils/zodValidationUtils/stringValidation";

const verifyOtpSchema = z.object({
  email: stringValidation("email").email("Email must be a valid email address"),
  otp: z
    .number({ required_error: "OTP Code is required" })
    .int("OTP Code must be a valid number")
    .positive("OTP Code must be a positive number")
    .max(999999, "OTP Code must be at most digits")
    .min(100000, "OTP Code must be at least 6 digits"),
});

export default verifyOtpSchema;
