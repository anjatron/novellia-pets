import "server-only";
import { cookies } from "next/headers";
import prisma from "../db/prisma";
import { UserRole } from "@/app/generated/prisma";

export type SessionUser = {
	id: string;
	firstName: string;
	lastName: string;
	role: UserRole;
};

// Get mock user id from the session
export async function getSessionUser(): Promise<SessionUser | null> {
	try {
		const cookieStore = await cookies();
		const userId = cookieStore.get("mock_user_id")?.value;

		if (!userId) return null;

		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: { id: true, firstName: true, lastName: true, role: true },
		});

		return user;
	} catch (error) {
		console.error("Error fetching session user: ", error);
		return null;
	}
}

// Helper method to extract user id if non-admin
export async function getSessionUserWithScope() {
	const user = await getSessionUser();

	if (!user) return { user: null, userId: null };

	const userId = user.role !== UserRole.ADMIN ? user.id : null;

	return { user, userId };
}
