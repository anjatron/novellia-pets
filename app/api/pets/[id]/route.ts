import { NextRequest, NextResponse } from "next/server";
import prisma from "@/server/db/prisma";
import { z } from "zod";
import {
	handlePrismaError,
	parseRequestBody,
	validationError,
} from "@/server/utils/api";
import { getSessionUserWithScope } from "@/server/utils/session";
import { PetUpdateServerSchema } from "@/types/schemas/pet";

// -- Schemas
const PetIdSchema = z.object({
	id: z.uuid(),
});

// -- Routes
// GET: Retrieve pet by id
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { user, userId } = await getSessionUserWithScope();
	if (!user) {
		// middleware will force login
		return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
	}

	const routeParams = await params;

	const parsedParams = PetIdSchema.safeParse(routeParams);
	if (!parsedParams.success) return validationError(parsedParams.error);

	const { id } = parsedParams.data;

	try {
		const pet = await prisma.pet.findFirst({
			where: {
				id,
				isDeleted: false,
				...(userId && { userId }), // will return 404 if user is not valid, avoid leaking resource existence
			},
			select: {
				id: true,
				name: true,
				animalType: true,
				dateOfBirth: true,
				createdAt: true,
				updatedAt: true,
				user: {
					select: {
						firstName: true,
						lastName: true,
					},
				},
			},
		});

		if (!pet) {
			return NextResponse.json({ error: "Pet not found." }, { status: 404 });
		}

		return NextResponse.json({ data: pet }, { status: 200 });
	} catch (error) {
		console.error("Error fetching pet: ", error);
		return NextResponse.json({ error: "Error fetching pet." }, { status: 500 });
	}
}

// PUT: Update pet by id
export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { user, userId } = await getSessionUserWithScope();
	if (!user) {
		// middleware will force login
		return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
	}

	const body = await parseRequestBody(request);
	if (!body) {
		return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
	}
	const routeParams = await params;

	const parsedParams = PetIdSchema.safeParse(routeParams);
	const parsedBody = PetUpdateServerSchema.safeParse(body);
	if (!parsedParams.success) return validationError(parsedParams.error);
	if (!parsedBody.success) return validationError(parsedBody.error);

	const { id } = parsedParams.data;
	const { name, animalType, dateOfBirth } = parsedBody.data;

	try {
		const updatedPet = await prisma.pet.update({
			where: {
				id,
				isDeleted: false,
				...(userId && { userId }),
			},
			data: {
				...(name && { name }),
				...(animalType && { animalType }),
				...(dateOfBirth && { dateOfBirth }),
			},
		});

		return NextResponse.json({ data: updatedPet }, { status: 200 });
	} catch (error) {
		return handlePrismaError(error, "Pet", "PUT");
	}
}

// DELETE: Delete pet by id
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { user, userId } = await getSessionUserWithScope();
	if (!user) {
		// middleware will force login
		return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
	}

	const routeParams = await params;
	const parsedParams = PetIdSchema.safeParse(routeParams);
	if (!parsedParams.success) return validationError(parsedParams.error);

	const { id } = parsedParams.data;

	try {
		const deletedPet = await prisma
			.$transaction([
				prisma.medicalRecord.updateMany({
					where: {
						petId: id,
						isDeleted: false,
					},
					data: { isDeleted: true, deletedAt: new Date() },
				}),
				prisma.pet.update({
					where: {
						id,
						...(userId && { userId }),
					},
					data: { isDeleted: true, deletedAt: new Date() },
				}),
			])
			.then(([_, pet]) => pet);

		return NextResponse.json({ data: deletedPet }, { status: 200 });
	} catch (error) {
		return handlePrismaError(error, "Pet", "DELETE");
	}
}
