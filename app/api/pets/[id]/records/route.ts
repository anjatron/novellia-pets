import { NextRequest, NextResponse } from "next/server";
import prisma from "@/server/db/prisma";
import { z } from "zod";
import { Prisma, RecordType } from "@/app/generated/prisma";
import { parseRequestBody, validationError } from "@/server/utils/api";
import { getSessionUserWithScope } from "@/server/utils/session";
import { MedicalRecordCreateServerSchema } from "@/types/schemas/record";

// -- Schemas
const PetIdSchema = z.object({
	id: z.uuid(),
});

const RecordQuerySchema = z.object({
	recordType: z.enum(RecordType).optional(),
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(50).default(10),
});

// -- Routes
// GET: Medical records for a pet
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
	const searchParams = request.nextUrl.searchParams;

	const parsedParams = PetIdSchema.safeParse(routeParams);
	const parsedQuery = RecordQuerySchema.safeParse({
		recordType: searchParams.get("recordType") ?? undefined,
		page: searchParams.get("page") ?? undefined,
		limit: searchParams.get("limit") ?? undefined,
	});
	if (!parsedParams.success) return validationError(parsedParams.error);
	if (!parsedQuery.success) return validationError(parsedQuery.error);

	const { id } = parsedParams.data;
	const { recordType, page, limit } = parsedQuery.data;
	const skip = (page - 1) * limit;

	try {
		const whereClause = {
			petId: id,
			isDeleted: false,
			...(userId && { pet: { userId } }), // will return 404 if user is not valid, avoid leaking resource existence
			...(recordType && { recordType }),
		};
		const [medicalRecords, total] = await Promise.all([
			prisma.medicalRecord.findMany({
				where: whereClause,
				skip,
				take: limit,
				orderBy: { createdAt: "desc" },
				select: {
					id: true,
					recordType: true,
					createdAt: true,
					pet: {
						select: { id: true },
					},
					vaccine: {
						select: {
							vaccineName: true,
							dateAdministered: true,
							nextDueDate: true,
						},
					},
					allergy: {
						select: {
							allergyName: true,
							reactions: true,
							severity: true,
						},
					},
				},
			}),
			prisma.medicalRecord.count({
				where: whereClause,
			}),
		]);

		return NextResponse.json(
			{
				data: medicalRecords,
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
		console.error("Error fetching medical records for pet: ", error);
		return NextResponse.json(
			{ error: "Error fetching medical records for pet." },
			{ status: 500 },
		);
	}
}

// POST: Create medical record for a pet
export async function POST(
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
	const parsedBody = MedicalRecordCreateServerSchema.safeParse(body);
	if (!parsedParams.success) return validationError(parsedParams.error);
	if (!parsedBody.success) return validationError(parsedBody.error);

	const { id } = parsedParams.data;

	// explicitly validate the pet belongs to the user
	// since we are connecting the medical record to the pet, not using a where clause
	const pet = await prisma.pet.findFirst({
		where: {
			id,
			...(userId && { userId }),
		},
	});
	if (!pet) {
		return NextResponse.json({ error: "Pet not found." }, { status: 404 });
	}

	const { recordType } = parsedBody.data;
	let data: Prisma.MedicalRecordCreateInput | undefined = undefined;

	if (recordType === RecordType.ALLERGY) {
		const { allergyName, reactions, severity } = parsedBody.data;
		data = {
			pet: { connect: { id } },
			recordType,
			allergy: {
				create: {
					allergyName,
					reactions,
					severity,
				},
			},
		};
	} else if (recordType === RecordType.VACCINE) {
		const { vaccineName, dateAdministered, nextDueDate } = parsedBody.data;
		data = {
			pet: { connect: { id } },
			recordType,
			vaccine: {
				create: {
					vaccineName,
					dateAdministered,
					nextDueDate,
				},
			},
		};
	}

	if (!data) {
		return NextResponse.json(
			{ error: "Invalid medical record type." },
			{ status: 400 },
		);
	}

	try {
		const newRecord = await prisma.medicalRecord.create({
			data,
			include: {
				vaccine: true,
				allergy: true,
			},
		});

		return NextResponse.json({ data: newRecord }, { status: 201 });
	} catch (error) {
		console.error("Error creating medical record for pet: ", error);
		return NextResponse.json(
			{ error: "Error creating medical record for pet." },
			{ status: 500 },
		);
	}
}
