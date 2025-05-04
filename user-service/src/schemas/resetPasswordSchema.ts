import { z } from "zod";
import stringValidation from "../utils/zodValidationUtils/stringValidation";

const resetPasswordSchema = z
  .object({
    email: stringValidation("email").email(
      "Email must be a valid email address"
    ),
    otp: stringValidation("otp", 6, 6),
    newPassword: stringValidation("newPassword", 8).regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/,
      "Password must include at least 1 uppercase letter, 1 lowercase letter, and 1 special character"
    ),
    confirmNewPassword: stringValidation("confirmNewPassword", 8).regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/,
      "Password must include at least 1 uppercase letter, 1 lowercase letter, and 1 special character"
    ),
  })
  .superRefine(({ newPassword, confirmNewPassword }, ctx) => {
    if (newPassword !== confirmNewPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
      });
    }
  });

export default resetPasswordSchema;
