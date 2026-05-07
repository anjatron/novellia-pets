import { NextResponse } from "next/server";
import prisma from "@/server/db/prisma";
import { handlePrismaError } from "@/server/utils/api";
import { getSessionUserWithScope } from "@/server/utils/session";

// GET: Get dashboard stats
export async function GET() {
	const { user, userId } = await getSessionUserWithScope();
	if (!user) {
		return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
	}

	// for ADMIN users we want to return stats for all pets
	// for non-admin users we want to return stats just for pets that belong to the user
	const whereClause = userId ? { userId } : {};

	try {
		const [totalPets, petsByType, upcomingVaccines, overdueVaccines] =
			await Promise.all([
				// get total pets
				prisma.pet.count({ where: whereClause }),
				// pets by type
				prisma.pet.groupBy({
					by: ["animalType"],
					where: whereClause,
					_count: { animalType: true },
				}),
				// upcoming vaccines - next 30 days
				prisma.vaccineRecord.findMany({
					where: {
						nextDueDate: {
							gte: new Date(),
							lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
						},
						record: { pet: { ...whereClause } },
					},
					include: {
						record: { include: { pet: true } },
					},
				}),
				// overdue vaccines
				prisma.vaccineRecord.findMany({
					where: {
						nextDueDate: { lt: new Date() },
						record: { pet: { ...whereClause } },
					},
					include: { record: { include: { pet: true } } },
				}),
			]);

		return NextResponse.json(
			{
				data: {
					totalPets,
					petsByType,
					upcomingVaccines,
					overdueVaccines,
				},
			},
			{ status: 200 },
		);
	} catch (error) {
		return handlePrismaError(error, "Dashboard", "fetching");
	}
}
