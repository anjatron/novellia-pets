"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { AnimalType } from "@/types/enums";
import { useState } from "react";
import { CreatePetRequest } from "@/types/pet";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface PetFormProps {
	defaultValues?: Partial<CreatePetRequest>;
	onSubmit: (data: CreatePetRequest) => Promise<void>;
	submitting: boolean;
	error: string | null;
	fieldErrors: Record<string, string[]> | null;
	submitLabel?: string;
}

// Reusable form component for creating and updating pets, with props to handle form state and submission
// Made life a lil easier to consolidate
export default function PetForm({
	defaultValues,
	onSubmit,
	submitting,
	error,
	fieldErrors,
	submitLabel = "Save",
}: PetFormProps) {
	const router = useRouter();
	const [animalType, setAnimalType] = useState<AnimalType | "">(
		defaultValues?.animalType ?? "",
	);

	const handleSubmit = async (formData: FormData) => {
		await onSubmit({
			name: formData.get("name") as string,
			animalType: animalType as AnimalType,
			dateOfBirth: formData.get("dateOfBirth") as string,
		});
	};

	return (
		<div className="max-w-lg">
			<Card>
				<CardContent className="pt-6 pb-2 px-8 space-y-6">
					<form action={handleSubmit}>
						<div className="rounded-md bg-gray-50 p-4 md:p-6">
							{/* Pet name */}
							<div className="mb-4">
								<label
									htmlFor="name"
									className="block text-sm font-medium text-gray-700"
								>
									Pet Name
									<span className="text-destructive">*</span>
								</label>
								<Input
									id="name"
									name="name"
									type="text"
									placeholder="Enter pet name"
									defaultValue={defaultValues?.name}
									aria-describedby="pet-name"
								/>
								{fieldErrors?.name && (
									<p className="mt-1 text-sm text-destructive">
										{fieldErrors.name[0]}
									</p>
								)}
							</div>
							{/* Pet type select */}
							<div className="mb-4">
								<label
									htmlFor="type"
									className="block text-sm font-medium text-gray-700"
								>
									Pet Type
									<span className="text-destructive">*</span>
								</label>
								<Select
									value={animalType}
									onValueChange={(v) => setAnimalType(v as AnimalType)}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select pet type" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="ALL">All</SelectItem>
										{Object.values(AnimalType).map((type) => (
											<SelectItem key={type} value={type}>
												{type}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{fieldErrors?.animalType && (
									<p className="mt-1 text-sm text-destructive">
										{fieldErrors.animalType[0]}
									</p>
								)}
							</div>
							{/* Pet date of birth select */}
							<div className="mb-4">
								<label
									htmlFor="dateOfBirth"
									className="block text-sm font-medium text-gray-700"
								>
									Pet Date of Birth
									<span className="text-destructive">*</span>
								</label>
								<Input
									id="dateOfBirth"
									name="dateOfBirth"
									type="date"
									defaultValue={defaultValues?.dateOfBirth}
									aria-describedby="pet-date-of-birth"
								/>
								{fieldErrors?.dateOfBirth && (
									<p className="mt-1 text-sm text-destructive">
										{fieldErrors.dateOfBirth[0]}
									</p>
								)}
							</div>
						</div>
						{error && <p className="text-sm text-destructive">{error}</p>}
						<div className="mt-6 flex justify-end gap-4">
							<Button
								type="button"
								variant="destructive"
								disabled={submitting}
								onClick={() => router.push("/pets")}
							>
								<span className="hidden md:block">Cancel</span>
							</Button>
							<Button type="submit" disabled={submitting}>
								{submitting ? "Saving..." : submitLabel}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
