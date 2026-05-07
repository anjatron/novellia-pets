import { NextResponse } from "next/server";
import prisma from "@/server/db/prisma";
import { handlePrismaError } from "@/server/utils/api";
import { getSessionUserWithScope } from "@/server/utils/session";

// GET: Get upcoming vaccines for dashboard
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
	const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

	try {
		const upcomingVaccines = await prisma.vaccineRecord.findMany({
			where: {
				nextDueDate: {
					gte: new Date(),
					lte: thirtyDaysFromNow,
				},
				record: { pet: { ...whereClause } },
			},
			select: {
				id: true,
				vaccineName: true,
				nextDueDate: true,
				dateAdministered: true,
				record: {
					select: {
						id: true,
						recordType: true,
						pet: {
							select: {
								id: true,
								name: true,
								animalType: true,
							},
						},
					},
				},
			},
		});

		return NextResponse.json(
			{
				data: upcomingVaccines,
			},
			{ status: 200 },
		);
	} catch (error) {
		return handlePrismaError(error, "Dashboard - Upcoming Vaccines", "GET");
	}
}
