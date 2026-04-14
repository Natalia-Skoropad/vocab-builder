export type PaginatedResponse<T> = {
  results: T[];
  totalPages: number;
  page: number;
  perPage: number;
};
