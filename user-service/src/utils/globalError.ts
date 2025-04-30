import TGlobalError from "../types/TGlobalError";
import httpStatusText from "./httpStatusText";

class GlobalError extends Error implements TGlobalError {
  public message: string;
  public statusCode: number;
  public statusText: string;
  constructor() {
    super();
    this.message = "Something went wrong";
    this.statusCode = 500;
    this.statusText = httpStatusText.ERROR;
  }

  create(message: string, statusCode: number, statusText: string) {
    this.message = message;
    this.statusCode = statusCode;
    this.statusText = statusText;
    return this;
  }
}

export default new GlobalError();
