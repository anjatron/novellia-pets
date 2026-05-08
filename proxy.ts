import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { UserRole } from "@/types/enums";

// Handle "mock" login session
// Curling api endpoints will require passing in a cookie - grab the user id from the db while testing
export function proxy(request: NextRequest) {
	const userId = request.cookies.get("mock_user_id")?.value;

	const isLoginPage = request.nextUrl.pathname === "/login";
	const isLoginApi = request.nextUrl.pathname === "/api/auth/login";
	// for mocklogin we display list of avaiable users - would not be the case in PROD
	const isUsersApi = request.nextUrl.pathname === "/api/users";

	// Don't block login routes
	if (isLoginPage || isLoginApi || isUsersApi) {
		return NextResponse.next();
	}

	// Redirect to login if no mock user was selected
	if (!userId) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	const isAdminRoute = request.nextUrl.pathname.startsWith("/dashboard");
	if (isAdminRoute) {
		const userRole = request.cookies.get("mock_user_role")?.value;
		if (userRole !== UserRole.ADMIN) {
			return NextResponse.redirect(new URL("/pets", request.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
