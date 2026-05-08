"use client";
import { usePetDetails } from "@/lib/hooks/pets/use-pet-details";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Cake, Pencil, Trash2 } from "lucide-react";
import { useDeletePet } from "@/lib/hooks/pets/use-delete-pet";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/common/dialog/confirm-dialog";
import { useMemo, useState } from "react";
import { ActionButtonGroup } from "@/components/common/action-button-group";
import { formatUTCDate, isBirthdayUpcoming } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// custom skeleton for pet details
// leaving it here
function PetDetailSkeleton() {
	return (
		<Card>
			<CardHeader>
				<Skeleton className="h-6 w-32" />
			</CardHeader>
			<CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className="space-y-1">
						<Skeleton className="h-3 w-16" />
						<Skeleton className="h-5 w-24" />
					</div>
				))}
			</CardContent>
		</Card>
	);
}

// custom error display for details card
function PetDetailError({ error }: { error: string }) {
	const router = useRouter();
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base">Failed to load pet</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				<p className="text-sm text-destructive">{error}</p>
				<Button variant="outline" size="sm" onClick={() => router.refresh()}>
					Try again
				</Button>
			</CardContent>
		</Card>
	);
}

export function PetDetail({ petId }: { petId: string }) {
	const { pet, loading, error } = usePetDetails(petId);
	const router = useRouter();
	const { submit: deletePet, submitting: deleting } = useDeletePet(() =>
		router.push("/pets"),
	);
	const [pendingDelete, setPendingDelete] = useState<string | null>(null);

	// birthday!!
	const { isUpcoming } = useMemo(() => {
		if (!pet) {
			return { isUpcoming: false };
		}

		return { isUpcoming: isBirthdayUpcoming(pet.dateOfBirth) };
	}, [pet]);

	if (loading) return <PetDetailSkeleton />;
	// the client side api will throw an error if pet is not found
	// hook state defaults pet to null so adding extra check here
	// to avoid further pet null checks
	if (error || !pet)
		return <PetDetailError error={error || "Something went wrong."} />;

	return (
		<Card>
			<CardHeader className="pb-2 flex flex-row items-center justify-between">
				<CardTitle className="text-xl">{pet?.name}</CardTitle>
				<div className="space-x-2">
					<ActionButtonGroup
						actions={[
							{
								label: "Edit",
								icon: <Pencil className="w-4 h-4" />,
								tooltip: `Edit ${pet.name}`,
								variant: "outline",
								disabled: deleting,
								onClick: () => router.push(`/pets/${pet.id}/edit`),
							},
							{
								label: "Delete",
								icon: <Trash2 className="w-4 h-4" />,
								tooltip: `Delete ${pet.name}`,
								variant: "destructive",
								disabled: deleting,
								onClick: () => setPendingDelete(pet.id),
							},
						]}
					/>
				</div>
			</CardHeader>
			<CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
				<div className="space-y-1">
					<p className="text-xs text-muted-foreground uppercase tracking-wide">
						Type
					</p>
					<p className="text-sm font-medium">
						{pet.animalType.charAt(0) + pet.animalType.slice(1).toLowerCase()}
					</p>
				</div>
				<div className="space-y-1">
					<p className="text-xs text-muted-foreground uppercase tracking-wide">
						Date of Birth
					</p>
					<p className="text-sm font-medium flex items-center gap-1">
						{formatUTCDate(pet.dateOfBirth)}
						{isUpcoming && <Cake className="w-4 h-4 text-pink-400" />}
					</p>
				</div>
				<div className="space-y-1">
					<p className="text-xs text-muted-foreground uppercase tracking-wide">
						Owner
					</p>
					<p className="text-sm font-medium">
						{pet.user.firstName} {pet.user.lastName}
					</p>
				</div>
			</CardContent>
			<ConfirmDialog
				open={!!pendingDelete}
				onOpenChange={(open) => !open && setPendingDelete(null)}
				onConfirm={() => {
					deletePet(pet.id);
					setPendingDelete(null);
				}}
				description="Uh oh! This will permanently delete the pet."
			/>
		</Card>
	);
}
