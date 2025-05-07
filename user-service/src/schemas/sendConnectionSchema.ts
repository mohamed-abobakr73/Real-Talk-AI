import { connect } from "http2";
import { z } from "zod";
import stringValidation from "../utils/zodValidationUtils/stringValidation";

const sendConnectionSchema = z.object({
  connectedUserId: stringValidation("connectedUserId").uuid(
    "Connected user ID must be a valid uuid"
  ),
});

export default sendConnectionSchema;
