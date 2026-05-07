"use client";
import { useTotalPets } from "@/lib/hooks/dashboard/use-total-pets";
import { SkeletonCard } from "../skeleton-card";
import { StatCardError } from "../stat-card-error";
import { StatCard } from "../stat-card";
import { PawPrint } from "lucide-react";

export function TotalPetsCard() {
	const { totalPets, loading, error, retry } = useTotalPets();

	if (loading) return <SkeletonCard />;
	if (error) return <StatCardError message={error} onRetry={retry} />;

	return (
		<StatCard
			label="Total Pets"
			value={totalPets}
			subLabel="across all users"
			icon={<PawPrint className="w-4 h-4" />}
		/>
	);
}
