import { OverdueVaccinesCard } from "@/components/dashboard/overdue-vaccine-card";
import { PetsByTypeCard } from "@/components/dashboard/pets-by-type-card";
import { TotalPetsCard } from "@/components/dashboard/total-pets-card";
import { UpcomingVaccinesCard } from "@/components/dashboard/upcoming-vaccines-card";

export const metadata = {
	title: "Dashboard | Novellia Pets",
	description: "Overview of all pets and upcoming vaccines.",
};

export default function DashboardPage() {
	return (
		<main className="space-y-6">
			<h1 className="text-xl font-medium">Dashboard</h1>
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
				<div className="flex flex-col gap-4">
					<TotalPetsCard />
					<UpcomingVaccinesCard />
					<OverdueVaccinesCard />
				</div>
				<div className="lg:col-span-2">
					<PetsByTypeCard />
				</div>
			</div>
		</main>
	);
}
