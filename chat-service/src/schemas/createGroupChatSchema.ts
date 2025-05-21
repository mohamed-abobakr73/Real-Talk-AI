import { z } from "zod";
import stringValidation from "../utils/zodValidationUtils/stringValidation";

const createGroupChatSchema = z.object({
  name: stringValidation("name", 1, 100),
});

export default createGroupChatSchema;
