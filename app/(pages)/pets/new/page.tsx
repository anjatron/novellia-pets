"use client";
import Breadcrumbs from "@/components/bread-crumbs";
import PetForm from "@/components/pets/pet-form";
import { useCreatePet } from "@/lib/hooks/pets/use-create-pet";

export default function NewPetPage() {
	const { submit, submitting, error, fieldErrors } = useCreatePet();

	return (
		<main className="w-full mx-auto">
			<Breadcrumbs
				breadcrumbs={[
					{ label: "Pets", href: "/pets" },
					{ label: "New Pet", href: "/pets/new" },
				]}
			/>
			<h1 className="text-xl font-medium py-4">Create New Pet</h1>
			<PetForm
				onSubmit={submit}
				submitting={submitting}
				error={error}
				fieldErrors={fieldErrors}
				submitLabel="Create Pet"
			/>
		</main>
	);
}
