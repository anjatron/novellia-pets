import { parseRequestBody } from "@/server/utils/api";
import { NextRequest, NextResponse } from "next/server";

// -- Routes
// POST: mock login
export async function POST(request: NextRequest) {
	const body = await parseRequestBody(request);
	if (!body) {
		return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
	}
	const { userId, role } = body;
	if (!userId) {
		return NextResponse.json({ error: "userId is required" }, { status: 400 });
	}

	const response = NextResponse.json({ success: true }, { status: 200 });
	response.cookies.set("mock_user_id", userId, { httpOnly: true, path: "/" });
	// WARNING - this is bad. only did this for middelware routing purposes
	// as a UX convenince in the demo, NOT FOR SECURITY
	// API routes validate the user from the database, so if a bad actor
	// changes this to a different role the server would still reject
	// In the real world, using NextAuth would store the session token security and cryptographically signed
	response.cookies.set("mock_user_role", role, { httpOnly: true, path: "/" });
	return response;
}
