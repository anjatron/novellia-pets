"use client";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { ReactNode, useState } from "react";

interface TriggeredDialogProps {
	title: string;
	children: (onClose: () => void) => ReactNode;
	icon?: ReactNode;
	disabled?: boolean;
}

export function TriggeredDialog({
	title,
	children,
	icon,
	disabled,
}: TriggeredDialogProps) {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button disabled={disabled}>
					{icon ? icon : <PlusIcon />}
					<span>{title}</span>
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>
				{children(() => setOpen(false))}
			</DialogContent>
		</Dialog>
	);
}
