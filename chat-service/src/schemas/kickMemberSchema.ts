import { z } from "zod";
import stringValidation from "../utils/zodValidationUtils/stringValidation";

const kickMemberSchema = z.object({
  memberToKickId: stringValidation("chat"),
});

export default kickMemberSchema;
