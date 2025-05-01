import { z } from "zod";
import stringValidation from "../utils/zodValidationUtils/stringValidation";

const signupSchema = z.object({
  username: stringValidation("username", 3, 20),
  email: stringValidation("email").email("Email must be a valid email address"),
  password: stringValidation("password", 8).regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/,
    "Password must include at least 1 uppercase letter, 1 lowercase letter, and 1 special character"
  ),
});

export type TSignupSchema = z.infer<typeof signupSchema>;
export default signupSchema;
