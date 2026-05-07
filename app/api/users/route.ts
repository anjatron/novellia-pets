import { NextResponse } from "next/server";
import prisma from "@/server/db/prisma";

// GET: Retrieve all users for mock login
export async function GET() {
	try {
		const users = await prisma.user.findMany({
			select: {
				id: true,
				firstName: true,
				lastName: true,
				role: true,
			},
		});
		return NextResponse.json({ data: users }, { status: 200 });
	} catch (error) {
		console.error("Error fetching users: ", error);
		return NextResponse.json(
			{ error: "Error fetching users." },
			{ status: 500 },
		);
	}
}
