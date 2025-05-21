import { z } from "zod";
import stringValidation from "../utils/zodValidationUtils/stringValidation";

const unMuteMemberSchema = z.object({
  memberToUnMuteId: stringValidation("memberToUnMuteId"),
});

export default unMuteMemberSchema;
