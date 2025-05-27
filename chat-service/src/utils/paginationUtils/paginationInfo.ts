import { TPaginationInfo } from "../../types";

const paginationInfo = (
  count: number,
  offset: number,
  limit: number
): TPaginationInfo => {
  const totalPages = Math.ceil(count / limit);

  return {
    totalItems: count,
    totalPages,
    currentPage: Math.ceil(offset / limit) + 1,
    itemsPerPage: limit,
  };
};

export default paginationInfo;
