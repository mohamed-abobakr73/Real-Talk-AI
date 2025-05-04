import { z } from "zod";
import stringValidation from "../utils/zodValidationUtils/stringValidation";

const loginSchema = z.object({
  email: stringValidation("email").email("Email must be a valid email address"),
  password: stringValidation("password", 8),
});

export default loginSchema;
