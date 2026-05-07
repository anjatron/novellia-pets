"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Severity, RecordType } from "@/types/enums";
import { useState } from "react";
import { useNewRecord } from "@/lib/hooks/records/use-new-record";
import { useUpdateRecord } from "@/lib/hooks/records/use-update-record";

interface AllergyFormProps {
	petId: string;
	onSuccess?: () => void;
	defaultValues?: { allergyName: string; reactions: string; severity: string };
	recordId?: string;
}

export default function AllergyForm({
	petId,
	onSuccess,
	defaultValues,
	recordId,
}: AllergyFormProps) {
	const [severity, setSeverity] = useState<Severity | "">(
		(defaultValues?.severity as Severity) ?? "",
	);

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
			recordType: RecordType.ALLERGY,
			allergyName: formData.get("allergyName") as string,
			reactions: formData.get("reactions") as string,
			severity: severity as Severity,
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
						Allergy Name
						<span className="text-destructive">*</span>
					</label>
					<Input
						id="allergyName"
						name="allergyName"
						type="text"
						placeholder="Enter allergy name"
						defaultValue={defaultValues?.allergyName}
						aria-required="true"
						aria-describedby={
							fieldErrors?.allergyName ? "alergyName-error" : "allergyName"
						}
					/>
					{fieldErrors?.allergyName && (
						<p className="mt-1 text-sm text-destructive" role="alert">
							{fieldErrors.allergyName[0]}
						</p>
					)}
				</div>
				<div>
					<label
						htmlFor="severity"
						className="block text-sm font-medium text-gray-700"
					>
						Severity
						<span className="text-destructive" aria-hidden="true">
							*
						</span>
					</label>
					<Select
						value={severity}
						onValueChange={(value) => setSeverity(value as Severity)}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select severity" />
						</SelectTrigger>
						<SelectContent
							aria-describedby={
								fieldErrors?.severity ? "severity-error" : "severity"
							}
							aria-required="true"
						>
							{Object.values(Severity).map((s) => (
								<SelectItem key={s} value={s}>
									{s.charAt(0) + s.slice(1).toLowerCase()}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{fieldErrors?.severity && (
						<p className="mt-1 text-sm text-destructive" role="alert">
							{fieldErrors.severity[0]}
						</p>
					)}
				</div>
				<div>
					<label
						htmlFor="reactions"
						className="block text-sm font-medium text-gray-700"
					>
						Reactions
						<span className="text-destructive" aria-hidden="true">
							*
						</span>
					</label>
					<Input
						id="reactions"
						name="reactions"
						type="text"
						placeholder="Describe reactions"
						defaultValue={defaultValues?.reactions}
						aria-required="true"
						aria-describedby={
							fieldErrors?.reactions ? "reactions-error" : "reactions"
						}
					/>
					{fieldErrors?.reactions && (
						<p className="mt-1 text-sm text-destructive" role="alert">
							{fieldErrors.reactions[0]}
						</p>
					)}
				</div>
			</div>
			{error && !fieldErrors && (
				<p className="mt-2 text-sm text-destructive">{error}</p>
			)}
			<div className="mt-4 flex justify-end">
				<Button type="submit" disabled={submitting} aria-busy={submitting}>
					{submitting ? "Saving..." : recordId ? "Save Changes" : "Add Allergy"}
				</Button>
			</div>
		</form>
	);
}
