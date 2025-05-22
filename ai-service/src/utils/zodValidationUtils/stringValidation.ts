import { z } from "zod";
const stringValidation = (fieldName: string, min?: number, max?: number) => {
  return z
    .string({
      required_error: `${fieldName} is required`,
      invalid_type_error: `${fieldName} must be a valid string`,
    })
    .min(min || 0, `${fieldName} must be at least ${min} characters`)
    .max(max || 255, `${fieldName} must be at most ${max} characters`);
};
export default stringValidation;
