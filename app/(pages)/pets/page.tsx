"use client";

import PetListTable from "@/components/pets/pet-list-table";

// pet list
export default function PetsPage() {
	return (
		<main>
			<div className="w-full mx-auto">
				<h1 className="text-xl font-medium">Pets</h1>
			</div>
			<PetListTable />
		</main>
	);
}
