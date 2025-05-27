import { TPaginationParams } from "../../types";

const paginationParams = (query: TPaginationParams) => {
  const limit: number = parseInt(query.limit || "10", 10);
  const page: number = parseInt(query.page || "1", 10);
  const offset = (page - 1) * limit;

  return { limit, offset };
};

export default paginationParams;
