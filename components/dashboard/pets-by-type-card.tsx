"use client";
import { usePetsByType } from "@/lib/hooks/dashboard/use-pets-by-type";
import { SkeletonCard } from "@/components/common/cards/skeleton-card";
import { StatCardError } from "@/components/common/cards/stat-card-error";
import { PieChartCard } from "@/components/common/cards/pie-chart-card";
import { ChartConfig } from "@/components/ui/chart";

const config: ChartConfig = {
	DOG: { label: "Dog", color: "#8B5CF6" },
	CAT: { label: "Cat", color: "#F59E0B" },
	RABBIT: { label: "Rabbit", color: "#EC4899" },
	BIRD: { label: "Bird", color: "#06B6D4" },
	HAMSTER: { label: "Hamster", color: "#F97316" },
	MOUSE: { label: "Mouse", color: "#6B7280" },
	HORSE: { label: "Horse", color: "#92400E" },
	SNAKE: { label: "Snake", color: "#10B981" },
	LIZARD: { label: "Lizard", color: "#84CC16" },
	OTHER: { label: "Other", color: "#94A3B8" },
};

export function PetsByTypeCard() {
	const { petsByType, loading, error, retry } = usePetsByType();

	if (loading) return <SkeletonCard />;
	if (error) return <StatCardError message={error} onRetry={retry} />;

	const chartData = petsByType.map((item) => ({
		name: item.animalType,
		value: item._count.animalType,
		fill: `var(--color-${item.animalType})`,
	}));
	return (
		<PieChartCard
			data={chartData}
			config={config}
			title="Pets by Type"
			description="Distribution of pets by type"
		/>
	);
}
