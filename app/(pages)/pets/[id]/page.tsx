import Breadcrumbs from "@/components/bread-crumbs";
import { PetDetail } from "@/components/pets/pet-detail";
import MedicalRecords from "@/components/pets/records/medical-records";

export const metadata = {
	title: "Pet | Novellia Pets",
	description: "View pet details.",
};

export default async function PetDetailsPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	return (
		<main className="w-full mx-auto">
			<Breadcrumbs
				breadcrumbs={[
					{ label: "Pets", href: "/pets" },
					{ label: "Pet Details", href: `/pets/${id}` },
				]}
			/>
			<h1 className="text-xl font-medium py-4">Pet Information</h1>
			<PetDetail petId={id} />
			<MedicalRecords petId={id} />
		</main>
	);
}
