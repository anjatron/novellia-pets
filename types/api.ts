// support pagination as optional
export interface ApiResponse<T> {
	data: T;
	pagination?: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
}

// zod formatted errors
export interface ApiError {
	error:
		| {
				formErrors: string[];
				fieldErrors: Record<string, string[]>;
		  }
		| string;
}
