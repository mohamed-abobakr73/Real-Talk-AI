import { TGlobalError } from "../types";
import httpStatusText from "./httpStatusText";
class GlobalError extends Error implements TGlobalError {
  public message: string;
  public statusCode: number;
  public statusText: string;
  public validationErrors?: string[];
  constructor() {
    super();
    this.message = "Something went wrong";
    this.statusCode = 500;
    this.statusText = httpStatusText.ERROR;
  }

  create(
    message: string,
    statusCode: number,
    statusText: string,
    validationErrors?: string[]
  ) {
    this.message = message;
    this.statusCode = statusCode;
    this.statusText = statusText;
    this.validationErrors = validationErrors;
    return this;
  }
}

export default new GlobalError();
