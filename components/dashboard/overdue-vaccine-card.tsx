"use client";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Syringe } from "lucide-react";
import { SkeletonCard } from "@/components/common/cards/skeleton-card";
import { StatCardError } from "@/components/common/cards/stat-card-error";
import { format } from "date-fns";
import { useOverdueVaccines } from "@/lib/hooks/dashboard/use-overdue-vaccines";

export function OverdueVaccinesCard() {
	const { data, loading, error, retry } = useOverdueVaccines();

	if (loading) return <SkeletonCard />;
	if (error) return <StatCardError message={error} onRetry={retry} />;

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<CardTitle className="text-sm font-medium text-muted-foreground">
					Overdue Vaccines
				</CardTitle>
				<Syringe className="w-4 h-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<p className="text-3xl font-bold mb-3 text-destructive">
					{data.length}
				</p>
				{data.length > 0 ? (
					<div className="space-y-2 max-h-[160px] overflow-y-auto">
						{data.map((vaccine) => (
							<div
								key={vaccine.id}
								className="flex items-center justify-between text-xs border border-destructive/20 bg-destructive/5 rounded-md px-2 py-1.5"
							>
								<div>
									<p className="font-medium">{vaccine.record.pet.name}</p>
									<p className="text-muted-foreground">{vaccine.vaccineName}</p>
								</div>
								<span className="text-muted-foreground shrink-0">
									{format(new Date(vaccine.nextDueDate), "MMM d")}
								</span>
							</div>
						))}
					</div>
				) : (
					<p className="text-xs text-muted-foreground">No upcoming vaccines</p>
				)}
			</CardContent>
		</Card>
	);
}
