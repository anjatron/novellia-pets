import { handleResponse } from "./client";
import { ApiResponse } from "@/types/api";
import { Pet, CreatePetRequest, UpdatePetRequest } from "@/types/pet";

export async function getPets(params?: {
	name?: string;
	animalType?: string;
	page?: number;
	limit?: number;
}): Promise<ApiResponse<Pet[]>> {
	const queryParams = new URLSearchParams();
	if (params?.name) queryParams.append("name", params.name);
	if (params?.animalType) queryParams.append("animalType", params.animalType);
	if (params?.page) queryParams.append("page", params.page.toString());
	if (params?.limit) queryParams.append("limit", params.limit.toString());

	const response = await fetch(`/api/pets?${queryParams.toString()}`);
	return handleResponse(response);
}

export async function getPet(id: string): Promise<ApiResponse<Pet>> {
	const response = await fetch(`/api/pets/${id}`);
	return handleResponse(response);
}

export async function createPet(
	data: CreatePetRequest,
): Promise<ApiResponse<Pet>> {
	const response = await fetch("/api/pets", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});
	return handleResponse(response);
}

export async function updatePet(
	id: string,
	data: UpdatePetRequest,
): Promise<ApiResponse<Pet>> {
	const response = await fetch(`/api/pets/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});
	return handleResponse(response);
}

export async function deletePet(id: string): Promise<void> {
	await fetch(`/api/pets/${id}`, {
		method: "DELETE",
	});
}
