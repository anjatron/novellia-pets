'use client";';
import { DataTable } from "@/components/data-table";
import { SkeletonTable } from "@/components/skeleton-table";
import { useMedicalRecords } from "@/lib/hooks/records/use-medical-records";
import { RecordType } from "@/types/enums";
import { getVaccineListColumns } from "./vaccine-list-columns";
import { useDeleteRecord } from "@/lib/hooks/records/use-delete-record";
import { useState } from "react";
import { MedicalRecord } from "@/types/record";
import VaccineForm from "./vaccine-form";
import { TriggeredDialog } from "@/components/triggered-dialog";
import { ControlledDialog } from "@/components/controlled-dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { TableError } from "@/components/table-error";

export default function VaccineRecordsTable({
	petId,
	page,
	onPageChange,
}: {
	petId: string;
	page: number;
	onPageChange: (page: number) => void;
}) {
	const { records, loading, error, refetch, totalPages } = useMedicalRecords({
		petId,
		recordType: RecordType.VACCINE,
	});
	const [editingRecord, setEditingRecord] = useState<MedicalRecord | null>(
		null,
	);
	const [pendingDelete, setPendingDelete] = useState<string | null>(null);
	const { submit: deleteRecord, submitting: deleting } =
		useDeleteRecord(refetch);
	const columns = getVaccineListColumns({
		petId,
		onDelete: (petId, recordId) => setPendingDelete(recordId),
		deleting,
		onEdit: (record) => setEditingRecord(record),
	});

	return (
		<div className="w-full mx-auto py-4">
			{/* Add vaccine form trigger */}
			<div className="flex justify-end mb-4">
				<TriggeredDialog title="Add Vaccine" disabled={loading}>
					{(onClose) => (
						<VaccineForm
							petId={petId}
							onSuccess={() => {
								refetch();
								onClose();
							}}
						/>
					)}
				</TriggeredDialog>
			</div>
			{/* records table */}
			{error && <TableError error={error} onRetry={refetch} />}
			{loading ? (
				<SkeletonTable />
			) : (
				<DataTable
					columns={columns}
					data={records}
					pagination={{ page, totalPages, onPageChange }}
				/>
			)}
			{/* Edit vaccine form */}
			<ControlledDialog
				open={!!editingRecord}
				onOpenChange={(open) => !open && setEditingRecord(null)}
				title="Edit Vaccine"
			>
				{editingRecord && (
					<VaccineForm
						petId={petId}
						recordId={editingRecord.id}
						defaultValues={{
							vaccineName: editingRecord.vaccine?.vaccineName ?? "",
							dateAdministered:
								editingRecord.vaccine?.dateAdministered.slice(0, 10) ?? "",
							nextDueDate:
								editingRecord.vaccine?.nextDueDate.slice(0, 10) ?? "",
						}}
						onSuccess={() => {
							refetch();
							setEditingRecord(null);
						}}
					/>
				)}
			</ControlledDialog>
			{/* confirm dialog for delete action */}
			<ConfirmDialog
				open={!!pendingDelete}
				onOpenChange={(open) => !open && setPendingDelete(null)}
				onConfirm={() => {
					deleteRecord(petId, pendingDelete!);
					setPendingDelete(null);
				}}
				description="Uh oh! This will permanently delete the medical record."
			/>
		</div>
	);
}
