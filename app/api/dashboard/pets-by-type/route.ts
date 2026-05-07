import { NextResponse } from "next/server";
import prisma from "@/server/db/prisma";
import { handlePrismaError } from "@/server/utils/api";
import { getSessionUserWithScope } from "@/server/utils/session";

// GET: Get pets by type for dashboard
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
		const petsByType = await prisma.pet.groupBy({
			by: ["animalType"],
			where: whereClause,
			_count: { animalType: true },
		});

		return NextResponse.json(
			{
				data: petsByType,
			},
			{ status: 200 },
		);
	} catch (error) {
		return handlePrismaError(error, "Dashboard - Pets By Type", "GET");
	}
}
