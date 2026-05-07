"use client";
// pet detail
import Breadcrumbs from "@/components/bread-crumbs";
import { PetDetail } from "@/components/pets/pet-detail";
import MedicalRecords from "@/components/pets/records/medical-records";
import { useParams } from "next/navigation";

export default function PetDetailsPage() {
	const params = useParams();
	const petId = params.id as string;
	return (
		<main className="w-full mx-auto">
			<Breadcrumbs
				breadcrumbs={[
					{ label: "Pets", href: "/pets" },
					{ label: "Pet Details", href: "/pets/[id]" },
				]}
			/>
			<h1 className="text-xl font-medium py-4">Pet Information</h1>
			<PetDetail petId={petId} />
			<MedicalRecords petId={petId} />
		</main>
	);
}
