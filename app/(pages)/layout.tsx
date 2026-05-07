"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function PagesLayout({ children }: { children: ReactNode }) {
	return (
		<TooltipProvider>
			<SidebarProvider>
				<AppSidebar />
				<main className="flex-1 flex flex-col min-h-screen bg-muted/30">
					<div className="border-b bg-background px-6 py-4 flex items-center gap-2">
						<SidebarTrigger />
					</div>
					<div className="flex-1 p-6">{children}</div>
				</main>
			</SidebarProvider>
		</TooltipProvider>
	);
}
