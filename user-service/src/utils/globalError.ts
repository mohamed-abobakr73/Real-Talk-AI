import TGlobalError from "../types/TGlobalError";
import httpStatusText from "./httpStatusText";

class GlobalError extends Error implements TGlobalError {
  public message: string;
  public statusCode: number;
  public statusText: string;
  public validationErrors?: string[];
  constructor(
    message: string,
    statusCode: number,
    statusText: string,
    validationErrors?: string[]
  ) {
    super();
    this.message = message || "Something went wrong";
    this.statusCode = statusCode || 500;
    this.statusText = statusText || httpStatusText.ERROR;
    this.validationErrors = validationErrors;
    return this;
  }
}

export default GlobalError;
