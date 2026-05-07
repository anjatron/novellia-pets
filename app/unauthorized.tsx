import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldX } from "lucide-react";

export default function Unauthorized() {
	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="text-center space-y-4">
				<ShieldX className="w-12 h-12 text-muted-foreground mx-auto" />
				<h1 className="text-2xl font-medium">Unauthorized</h1>
				<p className="text-sm text-muted-foreground">
					You do not have permission to access this page.
				</p>
				<Button asChild>
					<Link href="/login">Back to Login</Link>
				</Button>
			</div>
		</div>
	);
}
