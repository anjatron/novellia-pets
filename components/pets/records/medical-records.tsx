"use client";
import { RecordType } from "@/types/enums";
import { FunctionComponent, useState } from "react";
import AllergyRecordsTable from "./allergy/allergy-list-table";
import VaccineRecordsTable from "./vaccine/vaccine-list-table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const recordTypeToComponentMap: Record<
	RecordType,
	FunctionComponent<{
		petId: string;
		page: number;
		onPageChange: (page: number) => void;
	}>
> = {
	[RecordType.VACCINE]: VaccineRecordsTable,
	[RecordType.ALLERGY]: AllergyRecordsTable,
};

export default function MedicalRecords({ petId }: { petId: string }) {
	const [selectedType, setSelectedType] = useState<RecordType>(
		RecordType.VACCINE,
	);
	const [page, setPage] = useState(1);

	function handleTypeChange(type: string) {
		setSelectedType(type as RecordType);
		setPage(1);
	}

	const RecordsTable = recordTypeToComponentMap[selectedType];

	return (
		<div className="w-full mx-auto py-4">
			<h2 className="mb-4 text-lg font-medium">Medical Records</h2>
			<Select
				value={selectedType}
				onValueChange={(val) => handleTypeChange(val)}
			>
				<SelectTrigger className="w-[180px]">
					<SelectValue placeholder="Record type" />
				</SelectTrigger>
				<SelectContent>
					{Object.keys(recordTypeToComponentMap).map((type) => (
						<SelectItem key={type} value={type}>
							{type.charAt(0) + type.slice(1).toLowerCase()}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<RecordsTable petId={petId} page={page} onPageChange={setPage} />
		</div>
	);
}
