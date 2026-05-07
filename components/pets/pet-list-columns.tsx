"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Pet } from "@/types/pet";
import { Cake, Pencil, Trash2 } from "lucide-react";
import { ActionButtonGroup } from "@/components/action-button-group";
import { Badge } from "../ui/badge";
import { formatUTCDate, toTitleCase } from "@/lib/utils";

interface PetListProps {
	onDelete: (petId: string) => void;
	onEdit: (petId: string) => void;
	deleting: boolean;
}

// Function to generate column definitions for the pet list table
// Takes an onDelete callback and a deleting state to manage delete actions
// needed this to trigger refresh correctly without adding additional state management
export function getPetListColumns({
	onDelete,
	onEdit,
	deleting,
}: PetListProps): ColumnDef<Pet>[] {
	return [
		{
			accessorKey: "name",
			header: "Name",
		},
		{
			accessorKey: "animalType",
			header: "Animal Type",
			cell: ({ row }) => toTitleCase(row.original.animalType),
		},
		{
			accessorKey: "dateOfBirth",
			header: "Date of Birth",
			cell: ({ getValue }) => {
				const date = new Date(getValue() as string);
				const now = new Date();
				const thirtyDaysFromNow = new Date(
					Date.now() + 30 * 24 * 60 * 60 * 1000,
				);

				const birthday = new Date(date);
				birthday.setFullYear(now.getFullYear());

				if (birthday < now) {
					birthday.setFullYear(now.getFullYear() + 1);
				}

				if (birthday <= thirtyDaysFromNow) {
					return (
						<div className="flex items-center gap-1">
							{formatUTCDate(date.toLocaleDateString())}
							<Cake className="w-4 h-4 text-pink-400" />
						</div>
					);
				}
				return formatUTCDate(date.toLocaleDateString());
			},
		},
		{
			accessorKey: "user",
			header: "Owner",
			cell: ({ getValue }) => {
				const user = getValue() as { firstName: string; lastName: string };
				return `${user.firstName} ${user.lastName}`;
			},
		},
		{
			accessorKey: "vaccineStatus",
			header: "Vaccine Status",
			cell: ({ row }) => {
				const records = row.original.records;
				if (!records.length) return null;

				const now = new Date();
				const hasOverdue = records.some(
					(record) =>
						record.vaccine && new Date(record.vaccine.nextDueDate) < now,
				);
				const hasUpcoming = records.some(
					(record) =>
						record.vaccine && new Date(record.vaccine.nextDueDate) >= now,
				);

				return (
					<div className="flex gap-1 flex-wrap">
						{hasOverdue && <Badge variant="destructive">Overdue</Badge>}
						{hasUpcoming && (
							<Badge
								variant="outline"
								className="boarder-amber-500 text-amber-600 bg-amber-50"
							>
								Due Soon
							</Badge>
						)}
					</div>
				);
			},
		},
		{
			id: "actions",
			header: "Actions",
			cell: ({ row }) => {
				const pet = row.original;
				return (
					<ActionButtonGroup
						actions={[
							{
								label: "Edit",
								icon: <Pencil className="w-4 h-4" />,
								tooltip: "Edit pet",
								variant: "outline",
								disabled: deleting,
								onClick: () => onEdit(pet.id),
							},
							{
								label: "Delete",
								icon: <Trash2 className="w-4 h-4" />,
								tooltip: "Delete pet",
								variant: "destructive",
								disabled: deleting,
								onClick: () => onDelete(pet.id),
							},
						]}
					/>
				);
			},
		},
	];
}
