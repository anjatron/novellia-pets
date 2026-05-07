import { z } from "zod";
import { AnimalType } from "@/types/enums";

export const PetCreateSchema = z.object({
	name: z.string().min(1, "Pet name is required"),
	animalType: z.enum(AnimalType, "Animal type is required"),
	dateOfBirth: z.string("Date of birth is required"),
});

export const PetCreateServerSchema = PetCreateSchema.extend({
	dateOfBirth: z.coerce.date("Date of birth is required"),
});

export const PetUpdateSchema = z.object({
	name: z.string().min(1).optional(),
	animalType: z.enum(AnimalType).optional(),
	dateOfBirth: z.string().optional(),
});

export const PetUpdateServerSchema = PetUpdateSchema.extend({
	dateOfBirth: z.coerce.date().optional(),
});
