"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Syringe } from "lucide-react";
import { useUpcomingVaccines } from "@/lib/hooks/dashboard/use-upcoming-vaccines";
import { SkeletonCard } from "../skeleton-card";
import { StatCardError } from "../stat-card-error";
import { format } from "date-fns";

export function UpcomingVaccinesCard() {
	const { data, loading, error, retry } = useUpcomingVaccines();

	if (loading) return <SkeletonCard />;
	if (error) return <StatCardError message={error} onRetry={retry} />;

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<CardTitle className="text-sm font-medium text-muted-foreground">
					Upcoming Vaccines
				</CardTitle>
				<Syringe className="w-4 h-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<p className="text-3xl font-bold mb-3">{data.length}</p>
				{data.length > 0 ? (
					<div className="space-y-2 max-h-[160px] overflow-y-auto">
						{data.map((vaccine) => (
							<div
								key={vaccine.id}
								className="flex items-center justify-between text-xs border rounded-md px-2 py-1.5"
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
