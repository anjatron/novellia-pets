import "server-only";
import { Prisma } from "@/app/generated/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Helper method to return zod errors
export function validationError(error: z.ZodError) {
	console.error("Validation error: ", error);
	return NextResponse.json({ error: z.flattenError(error) }, { status: 400 });
}

// Helper method to handle prisma specific errors
export function handlePrismaError(
	error: unknown,
	resource: string,
	action: string,
) {
	console.error(`Error with ${resource}: `, error);
	if (error instanceof Prisma.PrismaClientKnownRequestError) {
		if (error.code === "P2025") {
			return NextResponse.json(
				{ error: `${resource} not found.` },
				{ status: 404 },
			);
		}
	}
	return NextResponse.json(
		{ error: `Error with ${action} ${resource}.` },
		{ status: 500 },
	);
}

// Helper method to parse json body form requests
export async function parseRequestBody(request: NextRequest) {
	try {
		return await request.json();
	} catch {
		return null;
	}
}
