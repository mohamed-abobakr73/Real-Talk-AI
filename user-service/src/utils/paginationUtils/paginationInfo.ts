import { TPaginationInfo } from "../../types";

const paginationInfo = (
  count: number,
  rows: number,
  limit: number
): TPaginationInfo => {
  const totalPages = Math.ceil(count / limit);

  return {
    totalItems: count,
    totalPages,
    currentPage: Math.ceil(rows / limit),
    itemsPerPage: limit,
  };
};

export default paginationInfo;
