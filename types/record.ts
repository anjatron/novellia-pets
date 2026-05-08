import { z } from "zod";
import {
	VaccineRecordSchema,
	AllergyRecordSchema,
	VaccineRecordUpdateSchema,
	AllergyRecordUpdateSchema,
} from "@/types/schemas/record";
import { RecordType } from "@/types/enums";

export interface MedicalRecord {
	id: string;
	recordType: RecordType;
	createdAt: string;
	pet: {
		id: string;
	};
	vaccine?: {
		vaccineName: string;
		dateAdministered: string;
		nextDueDate: string;
	};
	allergy?: {
		allergyName: string;
		reactions: string;
		severity: string;
	};
}

export type CreateVaccineRequest = z.infer<typeof VaccineRecordSchema>;
export type CreateAllergyRequest = z.infer<typeof AllergyRecordSchema>;
export type CreateMedicalRecordRequest =
	| CreateVaccineRequest
	| CreateAllergyRequest;

export type UpdateVaccineRequest = z.infer<typeof VaccineRecordUpdateSchema>;
export type UpdateAllergyRequest = z.infer<typeof AllergyRecordUpdateSchema>;
export type UpdateMedicalRecordRequest =
	| UpdateVaccineRequest
	| UpdateAllergyRequest;
