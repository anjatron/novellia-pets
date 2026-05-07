"use client";
import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/api/users";
import { User } from "@/types/user";
import { handleApiError } from "@/lib/api/client";

export function useCurrentUser() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	useEffect(() => {
		async function fetchCurrentUser() {
			try {
				const response = await getCurrentUser();
				setUser(response.data);
			} catch (err) {
				handleApiError(err, setError, {
					fallbackMessage:
						"An unexpected error occurred while fetching current user.",
				});
			} finally {
				setLoading(false);
			}
		}
		fetchCurrentUser();
	}, []);

	return { user, loading, error };
}
