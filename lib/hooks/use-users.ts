"use client";
import { useState, useEffect } from "react";
import { getUsers } from "@/lib/api/users";
import { User } from "@/types/user";
import { handleApiError } from "@/lib/api/client";

export function useUsers() {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await getUsers();
				setUsers(response.data);
			} catch (err) {
				handleApiError(err, setError, {
					fallbackMessage: "An unexpected error occurred while fetching users.",
				});
			} finally {
				setLoading(false);
			}
		};

		fetchUsers();
	}, []);

	return { users, loading, error };
}
