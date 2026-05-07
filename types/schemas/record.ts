import { z } from "zod";
import { RecordType, Severity } from "@/types/enums";

export const VaccineRecordSchema = z.object({
	recordType: z.literal(RecordType.VACCINE),
	vaccineName: z.string().min(1, "Vaccine name is required"),
	dateAdministered: z.string("Date administered is required"),
	nextDueDate: z.string("Next due date is required"),
});

export const VaccineRecordServerSchema = VaccineRecordSchema.extend({
	dateAdministered: z.coerce.date({ message: "Date administered is required" }),
	nextDueDate: z.coerce.date("Next due date is required"), // server requires date!!
});

export const AllergyRecordSchema = z.object({
	recordType: z.literal(RecordType.ALLERGY),
	allergyName: z.string().min(1, "Allergy name is required"),
	reactions: z.string().min(1, "Reactions are required"),
	severity: z.enum(Severity, "Severity is required"),
});

export const MedicalRecordCreateSchema = z.discriminatedUnion("recordType", [
	VaccineRecordSchema,
	AllergyRecordSchema,
]);

export const MedicalRecordCreateServerSchema = z.discriminatedUnion(
	"recordType",
	[VaccineRecordServerSchema, AllergyRecordSchema],
);

export const VaccineRecordUpdateSchema = z.object({
	recordType: z.literal(RecordType.VACCINE),
	vaccineName: z.string().min(1).optional(),
	dateAdministered: z.string().optional(),
	nextDueDate: z.string().optional(),
});

export const VaccineRecordUpdateServerSchema = VaccineRecordUpdateSchema.extend(
	{
		dateAdministered: z.coerce
			.date({ message: "Date administered is required" })
			.optional(),
		nextDueDate: z.coerce.date().optional(), // server requires date!!
	},
);

export const AllergyRecordUpdateSchema = z.object({
	recordType: z.literal(RecordType.ALLERGY),
	allergyName: z.string().min(1).optional(),
	reactions: z.string().min(1).optional(),
	severity: z.enum(Severity).optional(),
});

export const MedicalRecordUpdateSchema = z.discriminatedUnion("recordType", [
	VaccineRecordUpdateSchema,
	AllergyRecordUpdateSchema,
]);

export const MedicalRecordUpdateServerSchema = z.discriminatedUnion(
	"recordType",
	[VaccineRecordUpdateServerSchema, AllergyRecordUpdateSchema],
);
