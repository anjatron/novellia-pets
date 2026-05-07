"use client";
import Breadcrumbs from "@/components/bread-crumbs";
import PetForm from "@/components/pets/pet-form";
import { SkeletonCard } from "@/components/skeleton-card";
import { usePetDetails } from "@/lib/hooks/pets/use-pet-details";
import { useUpdatePet } from "@/lib/hooks/pets/use-update-pet";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function EditPetPage() {
	const router = useRouter();
	const params = useParams();
	const id = params.id as string;
	const { pet, loading, error } = usePetDetails(id);
	const {
		submit,
		submitting,
		error: updateError,
		fieldErrors,
	} = useUpdatePet(id);

	// redirect to pets list right away if loading pet details fails
	useEffect(() => {
		if (error) {
			toast.error("Failed to load pet details.");
			router.push("/pets");
		}
	}, [error, router]);

	return (
		<main className="w-full mx-auto">
			<Breadcrumbs
				breadcrumbs={[
					{ label: "Pets", href: "/pets" },
					{ label: "Update Pet", href: `/pets/${id}/edit` },
				]}
			/>
			<h1 className="text-xl font-medium py-4">Update Pet</h1>
			{loading ? (
				<SkeletonCard />
			) : (
				<PetForm
					defaultValues={{
						name: pet?.name,
						animalType: pet?.animalType,
						dateOfBirth: pet?.dateOfBirth?.slice(0, 10),
					}}
					onSubmit={submit}
					submitting={submitting}
					error={updateError}
					fieldErrors={fieldErrors}
					submitLabel="Save"
				/>
			)}
		</main>
	);
}
