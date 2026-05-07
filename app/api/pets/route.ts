import { NextRequest, NextResponse } from "next/server";
import prisma from "@/server/db/prisma";
import { z } from "zod";
import { AnimalType, RecordType } from "@/app/generated/prisma";
import {
	getSessionUser,
	getSessionUserWithScope,
} from "@/server/utils/session";
import { parseRequestBody, validationError } from "@/server/utils/api";
import { PetCreateServerSchema } from "@/types/schemas/pet";

// -- Schemas
const PetQuerySchema = z.object({
	name: z.string().min(1).optional(),
	animalType: z.enum(AnimalType).optional(),
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(50).default(10),
});

// -- Routes
// GET: Retrieve all pets
export async function GET(request: NextRequest) {
	const { user, userId } = await getSessionUserWithScope();

	if (!user) {
		return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
	}

	const searchParams = request.nextUrl.searchParams;
	const parsedQuery = PetQuerySchema.safeParse({
		name: searchParams.get("name") ?? undefined,
		animalType: searchParams.get("animalType") ?? undefined,
	});
	if (!parsedQuery.success) return validationError(parsedQuery.error);
	const { name, animalType, page, limit } = parsedQuery.data;
	const skip = (page - 1) * limit;
	const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

	try {
		const whereClause = {
			isDeleted: false,
			...(name && { name: { contains: name } }), // postgres would set mode "insensitive" explicitly
			...(animalType && { animalType }),
			...(userId && { userId }), // check userId for non-admin roles
		};

		const [pets, total] = await Promise.all([
			prisma.pet.findMany({
				where: whereClause,
				skip,
				take: limit,
				orderBy: { createdAt: "desc" },
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
					records: {
						where: {
							isDeleted: false,
							recordType: RecordType.VACCINE,
							vaccine: {
								nextDueDate: {
									lte: thirtyDaysFromNow,
								},
							},
						},
						select: {
							recordType: true,
							vaccine: {
								select: {
									vaccineName: true,
									nextDueDate: true,
									dateAdministered: true,
								},
							},
						},
					},
				},
			}),
			prisma.pet.count({
				where: whereClause,
			}),
		]);
		return NextResponse.json(
			{
				data: pets,
				pagination: {
					total,
					page,
					limit,
					totalPages: Math.ceil(total / limit),
				},
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error fetching users: ", error);
		return NextResponse.json(
			{ error: "Error fetching pets." },
			{ status: 500 },
		);
	}
}

// POST: Create new pet
export async function POST(request: NextRequest) {
	const user = await getSessionUser();
	if (!user) {
		return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
	}

	const body = await parseRequestBody(request);
	if (!body) {
		return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
	}

	const parsedBody = PetCreateServerSchema.safeParse(body);
	if (!parsedBody.success) return validationError(parsedBody.error);

	const { name, animalType, dateOfBirth } = parsedBody.data;

	try {
		const newPet = await prisma.pet.create({
			data: {
				name,
				animalType,
				dateOfBirth,
				userId: user.id,
			},
		});

		return NextResponse.json({ data: newPet }, { status: 201 });
	} catch (error) {
		console.error("Error creating new pet: ", error);
		return NextResponse.json(
			{ error: "Error creating new pet." },
			{ status: 500 },
		);
	}
}
