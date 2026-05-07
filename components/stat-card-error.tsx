import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StatCardError({
	message,
	onRetry,
}: {
	message: string;
	onRetry: () => void;
}) {
	return (
		<div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
			<p className="text-sm text-destructive mb-2">{message}</p>
			<Button
				onClick={onRetry}
				className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
			>
				<RefreshCw className="w-3 h-3" /> Retry
			</Button>
		</div>
	);
}
