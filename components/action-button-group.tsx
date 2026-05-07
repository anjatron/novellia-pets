import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface ActionButton {
	label?: string;
	icon?: React.ReactNode;
	onClick?: () => void;
	disabled?: boolean;
	tooltip?: string;
	variant?: "default" | "ghost" | "destructive" | "outline";
	size?:
		| "default"
		| "xs"
		| "sm"
		| "lg"
		| "icon"
		| "icon-xs"
		| "icon-sm"
		| "icon-lg";
}

export function ActionButtonGroup({ actions }: { actions: ActionButton[] }) {
	return (
		<div className="flex items-center gap-1">
			{actions.map((action) => (
				<Tooltip key={action.label}>
					<TooltipTrigger asChild>
						<Button
							variant={action.variant ?? "ghost"}
							size={action.size ?? "sm"}
							onClick={action.onClick ?? (() => {})}
							disabled={action.disabled ?? false}
							className={`${action.disabled ? "opacity-50 bg-gray-300" : ""}`}
						>
							{action.icon ?? null}
							{action.label ? (
								<span className="sr-only">{action.label}</span>
							) : null}
						</Button>
					</TooltipTrigger>
					{action.tooltip && (
						<TooltipContent className="px-2 py-1 text-sm">
							{action.tooltip}
						</TooltipContent>
					)}
				</Tooltip>
			))}
		</div>
	);
}
