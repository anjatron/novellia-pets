"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RecordType } from "@/types/enums";
import { useNewRecord } from "@/lib/hooks/records/use-new-record";
import { useUpdateRecord } from "@/lib/hooks/records/use-update-record";

interface VaccineFormProps {
	petId: string;
	onSuccess?: () => void;
	defaultValues?: {
		vaccineName: string;
		dateAdministered: string;
		nextDueDate: string;
	};
	recordId?: string;
}

export default function VaccineForm({
	petId,
	onSuccess,
	defaultValues,
	recordId,
}: VaccineFormProps) {
	// reuse and recycle
	// switch between create and update hooks
	// makes it easier to have one form that toggles between the two modes since it's a modal and not a full page with a route
	const createHook = useNewRecord(petId, onSuccess);
	const updateHook = useUpdateRecord(petId, recordId ?? "", onSuccess);
	const { submit, submitting, error, fieldErrors } = recordId
		? updateHook
		: createHook;

	const handleSubmit = async (formData: FormData) => {
		await submit({
			recordType: RecordType.VACCINE,
			vaccineName: formData.get("vaccineName") as string,
			dateAdministered: formData.get("dateAdministered") as string,
			nextDueDate: formData.get("nextDueDate") as string,
		});
	};

	return (
		<form action={handleSubmit}>
			<div className="rounded-md bg-gray-50 p-4 md:p-6 space-y-4">
				<div>
					<label
						htmlFor="allergyName"
						className="block text-sm font-medium text-gray-700"
					>
						Vaccine Name
						<span className="text-destructive">*</span>
					</label>
					<Input
						id="vaccineName"
						name="vaccineName"
						type="text"
						placeholder="Enter vaccine name"
						defaultValue={defaultValues?.vaccineName}
					/>
					{fieldErrors?.vaccineName && (
						<p className="mt-1 text-sm text-destructive">
							{fieldErrors.vaccineName[0]}
						</p>
					)}
				</div>
				<div>
					<label
						htmlFor="dateAdministered"
						className="block text-sm font-medium text-gray-700"
					>
						Date Administered
						<span className="text-destructive">*</span>
					</label>
					<Input
						id="dateAdministered"
						name="dateAdministered"
						type="date"
						defaultValue={defaultValues?.dateAdministered}
					/>
					{fieldErrors?.dateAdministered && (
						<p className="mt-1 text-sm text-destructive">
							{fieldErrors.dateAdministered[0]}
						</p>
					)}
				</div>
				<div>
					<label
						htmlFor="nextDueDate"
						className="block text-sm font-medium text-gray-700"
					>
						Next Due Date
					</label>
					<Input
						id="nextDueDate"
						name="nextDueDate"
						type="date"
						defaultValue={defaultValues?.nextDueDate}
					/>
					{fieldErrors?.nextDueDate && (
						<p className="mt-1 text-sm text-destructive">
							{fieldErrors.nextDueDate[0]}
						</p>
					)}
				</div>
			</div>
			{error && <p className="mt-2 text-sm text-destructive">{error}</p>}
			<div className="mt-4 flex justify-end">
				<Button type="submit" disabled={submitting}>
					{submitting ? "Saving..." : recordId ? "Save Changes" : "Add Vaccine"}
				</Button>
			</div>
		</form>
	);
}
