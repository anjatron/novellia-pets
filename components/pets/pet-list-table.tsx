"use client";
import { DataTable } from "@/components/data-table";
import { getPetListColumns } from "@/components/pets/pet-list-columns";
import { useDeletePet } from "@/lib/hooks/pets/use-delete-pet";
import { SkeletonTable } from "@/components/skeleton-table";
import { usePets } from "@/lib/hooks/pets/use-pets";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { PlusIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { AnimalType } from "@/types/enums";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { toTitleCase } from "@/lib/utils";
import { TableError } from "../table-error";

export default function PetListTable() {
	const [animalType, setAnimalType] = useState<AnimalType | undefined>(
		undefined,
	);
	const [searchTerm, setSearchTerm] = useState("");
	const debouncedSearchTerm = useDebounce(searchTerm, 300);
	const { pets, loading, error, refetch, page, totalPages, setPage } = usePets({
		name: debouncedSearchTerm,
		animalType,
	});
	const router = useRouter();
	const { submit: deletePet, submitting: deleting } = useDeletePet(refetch);
	const [pendingDelete, setPendingDelete] = useState<string | null>(null);

	function handleTypeChange(type: string) {
		setAnimalType(type === "All" ? undefined : (type as AnimalType));
		setPage(1);
	}

	function handleSearchChange(term: string) {
		setSearchTerm(term);
		setPage(1);
	}

	return (
		<div className="w-full mx-auto py-4">
			<div className="flex items-center gap-2 py-4">
				<div className="relative flex flex-1 flex-shrink-0">
					<Input
						disabled={loading}
						className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
						placeholder="Search pets..."
						value={searchTerm}
						onChange={(e) => handleSearchChange(e.target.value)}
					/>
					<SearchIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
				</div>
				<Select
					disabled={loading}
					value={animalType ?? "All"}
					onValueChange={(val) => handleTypeChange(val)}
				>
					<SelectTrigger className="w-40">
						<SelectValue placeholder="All" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="All">All</SelectItem>
						{Object.values(AnimalType).map((type) => (
							<SelectItem key={type} value={type}>
								{toTitleCase(type)}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Button disabled={loading} onClick={() => router.push("/pets/new")}>
					<span className="hidden md:block">New Pet</span>
					<PlusIcon className="animate-pulse" />
				</Button>
			</div>
			{error && <TableError error={error} onRetry={refetch} />}
			{loading ? (
				<SkeletonTable />
			) : (
				<DataTable
					columns={getPetListColumns({
						onDelete: (petId: string) => setPendingDelete(petId),
						onEdit: (petId) => router.push(`/pets/${petId}/edit`),
						deleting,
					})}
					data={pets}
					onRowClick={(pet) => router.push(`/pets/${pet.id}`)}
					pagination={{ page, totalPages, onPageChange: setPage }}
				/>
			)}
			{/* confirm dialog for delete action */}
			<ConfirmDialog
				open={!!pendingDelete}
				onOpenChange={(open) => !open && setPendingDelete(null)}
				onConfirm={() => {
					deletePet(pendingDelete!);
					setPendingDelete(null);
				}}
				description="Uh oh! This will permanently delete the pet."
			/>
		</div>
	);
}
