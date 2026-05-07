import { NextResponse } from "next/server";
import prisma from "@/server/db/prisma";
import { handlePrismaError } from "@/server/utils/api";
import { getSessionUserWithScope } from "@/server/utils/session";

// GET: Total pets for dashboard
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
		const totalPets = await prisma.pet.count({ where: whereClause });

		return NextResponse.json(
			{
				data: {
					totalPets,
				},
			},
			{ status: 200 },
		);
	} catch (error) {
		return handlePrismaError(error, "Dashboard - Total Pets", "GET");
	}
}
