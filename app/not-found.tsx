import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PawPrint } from "lucide-react";

export default function NotFound() {
	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="text-center space-y-4">
				<PawPrint className="w-12 h-12 text-muted-foreground mx-auto" />
				<h1 className="text-2xl font-medium">Page not found</h1>
				<p className="text-sm text-muted-foreground">
					This page does not exist.
				</p>
				<Button asChild>
					<Link href="/pets">Back to Pets</Link>
				</Button>
			</div>
		</div>
	);
}
