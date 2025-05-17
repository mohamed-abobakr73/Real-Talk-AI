import { z } from "zod";
import stringValidation from "../utils/zodValidationUtils/stringValidation";

const addMemberToChatSchema = z.object({
  memberId: stringValidation("memberId"),
  role: stringValidation("role", 1, 100),
});

export default addMemberToChatSchema;
