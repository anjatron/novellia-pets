import { getSessionUser } from "@/server/utils/session";
import { NextResponse } from "next/server";

// -- Routes
// GET: Get mock session user
export async function GET() {
	const user = await getSessionUser();
	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	return NextResponse.json({ data: user }, { status: 200 });
}
