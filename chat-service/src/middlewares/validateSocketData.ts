import { ZodSchema } from "zod";
import httpStatusText from "../utils/httpStatusText";
import GlobalError from "../utils/GlobalError";
import { fromZodError } from "zod-validation-error";

const validateSocketData = (schema: ZodSchema, rawData: unknown) => {
  const parsedSocketData = schema.safeParse(rawData);
  if (!parsedSocketData.success) {
    const error = new GlobalError(
      "Validation error",
      400,
      httpStatusText.FAIL,
      fromZodError(parsedSocketData.error).details.map((error) => error.message)
    );
    return { validatedData: parsedSocketData.data, error };
  }

  return { validatedData: parsedSocketData.data, error: null };
};

export default validateSocketData;
