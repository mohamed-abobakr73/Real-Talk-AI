import { z } from "zod";
import stringValidation from "../utils/zodValidationUtils/stringValidation";

const changeEmailSchema = z.object({
  newEmail: stringValidation("newEmail").email(
    "New email must be a valid email address"
  ),
});

export default changeEmailSchema;
