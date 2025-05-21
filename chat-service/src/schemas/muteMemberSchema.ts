import { z } from "zod";
import stringValidation from "../utils/zodValidationUtils/stringValidation";

const muteMemberSchema = z
  .object({
    memberToMuteId: stringValidation("memberToMuteId"),
    muteDate: z.coerce.date({
      required_error: "Mute date is required",
      invalid_type_error: "Mute date must be a valid date",
    }),
  })
  .superRefine((args, ctx) => {
    if (args.muteDate < new Date()) {
      ctx.addIssue({
        path: ["muteDate"],
        code: "custom",
        message: "Mute date must be in the future",
      });
    }
  });

export default muteMemberSchema;
