"use client";
import { usePathname, useRouter } from "next/navigation";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LayoutDashboard, PawPrint, LogOut } from "lucide-react";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import { logout } from "@/lib/api/users";
import { toast } from "sonner";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AppSidebar() {
	const pathname = usePathname();
	const router = useRouter();

	const { user, loading, error } = useCurrentUser();

	async function handleLogout() {
		try {
			await logout();
		} catch (error) {
			console.error("Error logging out: ", error);
			toast.error("Failed to logout. Please try again.");
		} finally {
			router.push("/login");
		}
	}

	const navItems = [
		...(user?.role === "ADMIN"
			? [{ label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" }]
			: []),
		{
			label: user?.role === "ADMIN" ? "All Pets" : "My Pets",
			icon: PawPrint,
			href: "/pets",
		},
	];

	return (
		<Sidebar className="border-r">
			<SidebarHeader className="border-b px-4 py-4">
				<h2 className="text-lg font-bold">Novellia Pets</h2>
			</SidebarHeader>
			<SidebarContent>
				<SidebarMenu>
					{!loading &&
						!error &&
						user &&
						navItems.map(({ label, icon: Icon, href }) => (
							<SidebarMenuItem key={href} className="p-2 hover:bg-muted">
								<SidebarMenuButton asChild isActive={pathname === href}>
									<Link href={href}>
										<Icon />
										{label}
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
				</SidebarMenu>
			</SidebarContent>
			<SidebarFooter className="border-t">
				<SidebarMenu>
					{user && (
						<SidebarMenuItem>
							<div className="flex items-center gap-3 px-2 py-3">
								<Avatar>
									<AvatarImage
										src="https://github.com/evilrabbit.png"
										alt="User Avatar"
									/>
									<AvatarFallback>
										{user.firstName[0]}
										{user.lastName[0]}
									</AvatarFallback>
								</Avatar>
								<div className="flex flex-col">
									<span className="text-sm font-medium">
										{user.firstName} {user.lastName}
									</span>
									<span className="text-xs text-muted-foreground capitalize">
										{user.role.toLowerCase()}
									</span>
								</div>
							</div>
						</SidebarMenuItem>
					)}
					<SidebarMenuItem>
						<SidebarMenuButton
							onClick={handleLogout}
							className="text-muted-foreground hover:text-destructive"
						>
							<LogOut className="w-4 h-4" />
							<span>Sign Out</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
