import { NextResponse } from "next/server";

// -- Routes
// POST: mock logout
export async function POST() {
	const response = NextResponse.json({ success: true }, { status: 200 });
	response.cookies.delete("mock_user_id");
	response.cookies.delete("mock_user_role");
	return response;
}
