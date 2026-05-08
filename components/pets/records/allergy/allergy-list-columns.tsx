"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { MedicalRecord } from "@/types/record";
import { ActionButtonGroup } from "@/components/common/action-button-group";
import { toTitleCase } from "@/lib/utils";

interface AllergyListColumnProps {
	petId: string;
	onDelete: (petId: string, recordId: string) => void;
	deleting: boolean;
	onEdit: (record: MedicalRecord) => void;
}

// Function to generate column definitions for the records list table
// Takes an onDelete callback and a deleting state to manage delete actions
// needed this to trigger refresh correctly without adding additional state management
export function getAllergyListColumns({
	petId,
	onDelete,
	deleting,
	onEdit,
}: AllergyListColumnProps): ColumnDef<MedicalRecord>[] {
	return [
		{
			id: "allergyName",
			header: "Allergy Name",
			cell: ({ row }) => row.original.allergy?.allergyName,
		},
		{
			id: "severity",
			header: "Severity",
			cell: ({ row }) => toTitleCase(row.original.allergy?.severity ?? ""),
		},
		{
			id: "reactions",
			header: "Reactions",
			cell: ({ row }) => row.original.allergy?.reactions,
		},
		{
			id: "actions",
			header: "Actions",
			cell: ({ row }) => {
				const record = row.original;
				return (
					<ActionButtonGroup
						actions={[
							{
								label: "Edit",
								icon: <Pencil className="w-4 h-4" />,
								tooltip: "Edit record",
								variant: "outline",
								disabled: deleting,
								onClick: () => onEdit(record),
							},
							{
								label: "Delete",
								icon: <Trash2 className="w-4 h-4" />,
								tooltip: "Delete record",
								variant: "destructive",
								disabled: deleting,
								onClick: () => onDelete(petId, record.id),
							},
						]}
					/>
				);
			},
		},
	];
}
