"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
	label: string;
	value: number | null | string;
	subLabel?: string;
	icon?: React.ReactNode;
}

export function StatCard({ label, value, subLabel, icon }: StatCardProps) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<CardTitle className="text-sm font-medium text-muted-foreground">
					{label}
				</CardTitle>
				{icon && <span className="text-muted-foreground">{icon}</span>}
			</CardHeader>
			<CardContent>
				<p className="text-3xl font-bold">{value ?? "—"}</p>
				{subLabel && (
					<p className="text-xs text-muted-foreground mt-1">{subLabel}</p>
				)}
			</CardContent>
		</Card>
	);
}
