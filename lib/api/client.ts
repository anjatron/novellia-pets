"use client";

import { toast } from "sonner";

export class ApiError extends Error {
	fieldErrors: { [key: string]: string[] } | undefined;
	constructor(
		public status: number,
		message: string,
		fieldErrors?: { [key: string]: string[] },
	) {
		super(message);
		this.name = "ApiError";
		this.fieldErrors = fieldErrors;
	}
}

export async function handleResponse(res: Response) {
	if (!res.ok) {
		const body = await res.json().catch(() => ({}));
		// need to handle both string errors and zod validation errors
		const message =
			typeof body.error === "string"
				? body.error
				: (body.error?.formErrors?.[0] ?? "Something went wrong");

		const fieldErrors = body.error?.fieldErrors ?? null;
		throw new ApiError(res.status, message, fieldErrors);
	}
	return res.json();
}

// helper method to handle errors returns by the api in hooks
// was a bit tedious rewriting them
export function handleApiError(
	error: unknown,
	setError: (msg: string) => void,
	options?: {
		setFieldErrors?: (errors: Record<string, string[]> | null) => void;
		fallbackMessage?: string;
		onUnauthorized?: () => void;
		showToast?: boolean;
	},
) {
	if (error instanceof ApiError) {
		if (error.status === 401) {
			options?.onUnauthorized?.();
			return;
		}
		setError(error.message);
		options?.setFieldErrors?.(error.fieldErrors ?? null);
		if (options?.showToast) toast.error(error.message);
	} else {
		const message = options?.fallbackMessage ?? "An unexpected error occurred.";
		setError(message);
		if (options?.showToast) toast.error(message);
	}
}
