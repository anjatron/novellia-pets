"use client";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react/jsx-runtime";

interface BreadcrumbConfig {
	label: string;
	href: string;
	active?: boolean;
}

export default function Breadcrumbs({
	breadcrumbs,
}: {
	breadcrumbs: BreadcrumbConfig[];
}) {
	return (
		<Breadcrumb>
			<BreadcrumbList>
				{breadcrumbs.map((crumb, index) => (
					<Fragment key={crumb.href}>
						<BreadcrumbItem>
							{crumb.active ? (
								<BreadcrumbPage>{crumb.label}</BreadcrumbPage>
							) : (
								<BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
							)}
						</BreadcrumbItem>
						{index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
					</Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
