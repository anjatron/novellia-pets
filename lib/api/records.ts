import { ApiResponse } from "@/types/api";
import {
	CreateMedicalRecordRequest,
	UpdateMedicalRecordRequest,
	MedicalRecord,
} from "@/types/record";
import { handleResponse } from "./client";

export async function getMedicalRecordsForPet(params: {
	petId: string;
	recordType?: string;
	page?: number;
	limit?: number;
}): Promise<ApiResponse<MedicalRecord[]>> {
	const queryParams = new URLSearchParams();
	if (params?.recordType) queryParams.append("recordType", params.recordType);
	if (params?.page) queryParams.append("page", params.page.toString());
	if (params?.limit) queryParams.append("limit", params.limit.toString());

	const response = await fetch(
		`/api/pets/${params.petId}/records?${queryParams.toString()}`,
	);
	return handleResponse(response);
}

export async function createMedicalRecord(
	petId: string,
	data: CreateMedicalRecordRequest,
): Promise<ApiResponse<MedicalRecord>> {
	const response = await fetch(`/api/pets/${petId}/records`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	return handleResponse(response);
}

export async function updateMedicalRecord(
	petId: string,
	recordId: string,
	data: UpdateMedicalRecordRequest,
): Promise<ApiResponse<MedicalRecord>> {
	const response = await fetch(`/api/pets/${petId}/records/${recordId}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	return handleResponse(response);
}

export async function deleteMedicalRecord(
	petId: string,
	recordId: string,
): Promise<void> {
	await fetch(`/api/pets/${petId}/records/${recordId}`, {
		method: "DELETE",
	});
}
