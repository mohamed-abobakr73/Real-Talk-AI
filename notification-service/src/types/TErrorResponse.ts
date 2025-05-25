type TErrorResponse = {
  status: string;
  message: string;
  code: number;
  validationErrors?: string[];
  data: any;
};

export default TErrorResponse;
