import { handleResponse } from "./client";
import { ApiResponse } from "@/types/api";
import { User } from "@/types/user";

export async function getUsers(): Promise<ApiResponse<User[]>> {
	const response = await fetch("/api/users");
	return handleResponse(response);
}

export async function login(userId: string, role: string): Promise<void> {
	const response = await fetch("api/auth/login", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ userId, role }),
	});
	return handleResponse(response);
}

export async function getCurrentUser() {
	const res = await fetch("/api/auth/user");
	return handleResponse(res);
}

export async function logout() {
	const response = await fetch("api/auth/logout", {
		method: "POST",
	});
	return handleResponse(response);
}
