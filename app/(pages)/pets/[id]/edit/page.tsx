import EditPetView from "@/components/pets/pet-edit-view";

export const metadata = {
	title: "Edit Pet | Novellia Pets",
	description: "Edit a pet.",
};

export default async function EditPetPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	return <EditPetView petId={id} />;
}
