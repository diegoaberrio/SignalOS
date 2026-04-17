import { DEFAULT_PAGINATION, SORT_ORDERS } from "../config/constants.js";

export const parsePagination = (query) => {
  const page = Math.max(
    Number(query.page) || DEFAULT_PAGINATION.PAGE,
    DEFAULT_PAGINATION.PAGE
  );

  const requestedPageSize =
    Number(query.page_size) || DEFAULT_PAGINATION.PAGE_SIZE;

  const pageSize = Math.min(
    Math.max(requestedPageSize, 1),
    DEFAULT_PAGINATION.MAX_PAGE_SIZE
  );

  const offset = (page - 1) * pageSize;

  return {
    page,
    pageSize,
    offset,
    limit: pageSize,
  };
};

export const buildPaginationMeta = ({
  page,
  pageSize,
  totalItems,
}) => {
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize);

  return {
    pagination: {
      page,
      page_size: pageSize,
      total_items: totalItems,
      total_pages: totalPages,
    },
  };
};

export const parseSortOrder = (value) => {
  if (!value) return SORT_ORDERS.DESC;

  const normalized = String(value).toLowerCase();
  return normalized === SORT_ORDERS.ASC ? SORT_ORDERS.ASC : SORT_ORDERS.DESC;
};