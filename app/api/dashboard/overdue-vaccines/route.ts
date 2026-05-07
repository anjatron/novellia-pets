import { NextResponse } from "next/server";
import prisma from "@/server/db/prisma";
import { handlePrismaError } from "@/server/utils/api";
import { getSessionUserWithScope } from "@/server/utils/session";

// GET: Get overdue vaccines for dashboard
export async function GET() {
	const { user, userId } = await getSessionUserWithScope();
	if (!user) {
		return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
	}

	// for ADMIN users we want to return stats for all pets
	// for non-admin users we want to return stats just for pets that belong to the user
	const whereClause = {
		isDeleted: false,
		...(userId && { userId }), // check userId for non-admin roles
	};

	try {
		const overdueVaccines = await prisma.vaccineRecord.findMany({
			where: {
				nextDueDate: { lt: new Date() },
				record: { pet: { ...whereClause } },
			},
			include: { record: { include: { pet: true } } },
		});

		return NextResponse.json(
			{
				data: overdueVaccines,
			},
			{ status: 200 },
		);
	} catch (error) {
		return handlePrismaError(error, "Dashboard - Overdue Vaccines", "GET");
	}
}
