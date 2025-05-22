type TGlobalError = {
  message: string;
  statusCode: number;
  statusText: string;
  validationErrors?: string[];
};

export default TGlobalError;
