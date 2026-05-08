"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { MedicalRecord } from "@/types/record";
import { ActionButtonGroup } from "@/components/common/action-button-group";
import { Badge } from "@/components/ui/badge";
import { formatUTCDate } from "@/lib/utils";

interface VaccineListColumnProps {
	petId: string;
	onDelete: (petId: string, recordId: string) => void;
	deleting: boolean;
	onEdit: (record: MedicalRecord) => void;
}

// Function to generate column definitions for the list table
// Takes an onDelete callback and a deleting state to manage delete actions
// needed this to trigger refresh correctly without adding additional state management
export function getVaccineListColumns({
	petId,
	onDelete,
	deleting,
	onEdit,
}: VaccineListColumnProps): ColumnDef<MedicalRecord>[] {
	return [
		{
			id: "vaccineName",
			header: "Vaccine Name",
			cell: ({ row }) => row.original.vaccine?.vaccineName,
		},
		{
			id: "dateAdministered",
			header: "Date Administered",
			cell: ({ row }) => {
				return row.original.vaccine?.dateAdministered
					? formatUTCDate(row.original.vaccine.dateAdministered)
					: null;
			},
		},
		{
			id: "nextDueDate",
			header: "Next Due Date",
			cell: ({ row }) => {
				return row.original.vaccine?.nextDueDate
					? formatUTCDate(row.original.vaccine.nextDueDate)
					: null;
			},
		},
		{
			accessorKey: "vaccineSatus",
			header: "Vaccine Status",
			cell: ({ row }) => {
				const vaccine = row.original.vaccine;
				if (!vaccine?.nextDueDate) return null;

				const now = new Date();
				const nextDueDate = new Date(vaccine.nextDueDate);
				const thirtyDaysFromNow = new Date(
					Date.now() + 30 * 24 * 60 * 60 * 1000,
				);

				if (nextDueDate < now) {
					return <Badge variant="destructive">Overdue</Badge>;
				}
				if (nextDueDate <= thirtyDaysFromNow) {
					return (
						<Badge
							variant="outline"
							className="border-amber-500 text-amber-600 bg-amber-50"
						>
							Due Soon
						</Badge>
					);
				}
				return (
					<Badge
						variant="outline"
						className="border-green-500 text-green-600 bg-green-50"
					>
						Up to Date
					</Badge>
				);
			},
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
