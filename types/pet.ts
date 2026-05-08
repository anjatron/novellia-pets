import { z } from "zod";
import { PetCreateSchema, PetUpdateSchema } from "@/types/schemas/pet";
import { AnimalType, RecordType } from "@/types/enums";

export interface Pet {
	id: string;
	name: string;
	animalType: AnimalType;
	dateOfBirth: string;
	createdAt: string;
	updatedAt: string;
	user: {
		firstName: string;
		lastName: string;
	};
	records: {
		recordType: RecordType;
		vaccine: {
			vaccineName: string;
			nextDueDate: string;
			dateAdministered: string;
		};
	}[];
}

export type CreatePetRequest = z.infer<typeof PetCreateSchema>;
export type UpdatePetRequest = z.infer<typeof PetUpdateSchema>;
