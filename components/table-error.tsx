"use client";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TableError({
	error,
	onRetry,
}: {
	error: string;
	onRetry: () => void;
}) {
	return (
		<div className="flex flex-col items-center justify-center py-12 space-y-3">
			<p className="text-sm text-destructive">{error}</p>
			<Button variant="outline" size="sm" onClick={onRetry}>
				<RefreshCw className="w-3 h-3 mr-1" />
				Try again
			</Button>
		</div>
	);
}
