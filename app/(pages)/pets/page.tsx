import PetListTable from "@/components/pets/pet-list-table";

export const metadata = {
	title: "Pets | Novellia Pets",
	description: "Manage your pets and their medical records.",
};

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
