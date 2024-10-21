export interface PaginationOptions {
    page: number;
    totalCount: number;
    totalPages: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}
