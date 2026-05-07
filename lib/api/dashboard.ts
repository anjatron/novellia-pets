import { handleResponse } from "./client";
import { ApiResponse } from "@/types/api";
import {
	PetsByTypeStats,
	TotalPetsStats,
	UpcomingVaccineStats,
	OverdueVaccineStats,
} from "@/types/dashboard";

// get dashboard stats
export async function getTotalPetsStats(): Promise<
	ApiResponse<TotalPetsStats>
> {
	const response = await fetch("/api/dashboard/total-pets");
	return handleResponse(response);
}

export async function getPetsByTypeStats(): Promise<
	ApiResponse<PetsByTypeStats[]>
> {
	const response = await fetch("/api/dashboard/pets-by-type");
	return handleResponse(response);
}

export async function getUpcomingVaccines(): Promise<
	ApiResponse<UpcomingVaccineStats[]>
> {
	const response = await fetch("/api/dashboard/upcoming-vaccines");
	return handleResponse(response);
}

export async function getOverdueVaccines(): Promise<
	ApiResponse<OverdueVaccineStats[]>
> {
	const response = await fetch("/api/dashboard/overdue-vaccines");
	return handleResponse(response);
}
