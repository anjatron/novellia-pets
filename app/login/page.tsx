"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useUsers } from "@/lib/hooks/use-users";
import { login } from "@/lib/api/users";
import { User } from "@/types/user";
import { UserRole } from "@/types/enums";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

// mock login selection
export default function LoginPage() {
	const router = useRouter();

	const { users, loading, error } = useUsers();

	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [submitting, setSubmitting] = useState(false);

	function handleSelect(userId: string) {
		const user = users.find((user) => user.id === userId) ?? null;
		setSelectedUser(user);
	}

	async function handleSubmit() {
		if (!selectedUser) return;

		setSubmitting(true);

		try {
			await login(selectedUser.id, selectedUser.role);
			if (selectedUser.role === UserRole.ADMIN) {
				router.push("/dashboard");
			} else {
				router.push("/pets");
			}
		} catch (error) {
			console.error("Error logging in: ", error);
			toast.error("Failed to login. Please try again.");
		} finally {
			setSubmitting(false);
		}
	}

	// display helper methods
	function getInitials(user: User) {
		return `${user.firstName[0]}${user.lastName[0]}`;
	}
	function getRoleDescription(user: User) {
		return user.role === UserRole.ADMIN
			? "Admin - access to all pets and dashboard stats"
			: "User - access to your own pets";
	}

	return (
		<div className="min-h-screen flex items-center justify-center p-8">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<CardTitle>Welcome to Novellia Pets!</CardTitle>
					<CardDescription>Select a user to continue</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-6">
						<Label>Sign in as</Label>
						{loading ? (
							<Spinner className="size-6 items-center" />
						) : error ? (
							<p className="text-sm text-destructive">{error}</p>
						) : (
							<Select onValueChange={handleSelect}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select a user..." />
								</SelectTrigger>
								<SelectContent>
									{users.map((user) => (
										<SelectItem key={user.id} value={user.id}>
											{user.firstName} {user.lastName} — {user.role}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}

						{selectedUser && (
							<div className="bg-muted rounded-lg p-3 mb-5 flex items-center gap-3">
								<div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-700 shrink-0">
									{getInitials(selectedUser)}
								</div>
								<div>
									<p className="text-sm font-medium">
										{selectedUser.firstName} {selectedUser.lastName}
									</p>
									<p className="text-xs text-muted-foreground">
										{getRoleDescription(selectedUser)}
									</p>
								</div>
							</div>
						)}

						<Button
							className="w-full"
							variant="outline"
							onClick={handleSubmit}
							disabled={!selectedUser || submitting}
						>
							{!selectedUser ||
								(submitting && <Spinner data-icon="inline-start" />)}
							{submitting ? "Signing in..." : "Continue"}
						</Button>

						<p className="text-xs text-muted-foreground text-center mt-4">
							Mock login for demo purposes
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
