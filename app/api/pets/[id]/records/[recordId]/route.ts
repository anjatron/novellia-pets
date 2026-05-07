import { NextRequest, NextResponse } from "next/server";
import prisma from "@/server/db/prisma";
import { z } from "zod";
import { Prisma, RecordType } from "@/app/generated/prisma";
import {
	handlePrismaError,
	parseRequestBody,
	validationError,
} from "@/server/utils/api";
import { getSessionUserWithScope } from "@/server/utils/session";
import { MedicalRecordUpdateServerSchema } from "@/types/schemas/record";

// -- Schemas
const RouteIdSchema = z.object({
	id: z.uuid(),
	recordId: z.uuid(),
});

// -- Routes
// GET: Medical record for a pet by id
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string; recordId: string }> },
) {
	const { user, userId } = await getSessionUserWithScope();
	if (!user) {
		// middleware will force login
		return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
	}

	const routeParams = await params;

	const parsedParams = RouteIdSchema.safeParse(routeParams);
	if (!parsedParams.success) return validationError(parsedParams.error);

	const { id, recordId } = parsedParams.data;

	try {
		const medicalRecord = await prisma.medicalRecord.findFirst({
			where: {
				id: recordId,
				pet: {
					id,
					...(userId && { userId }),
				},
			},
			select: {
				id: true,
				recordType: true,
				createdAt: true,
				petId: true,
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
		});

		if (!medicalRecord) {
			return NextResponse.json(
				{ error: "Medical record not found." },
				{ status: 404 },
			);
		}

		return NextResponse.json({ data: medicalRecord }, { status: 200 });
	} catch (error) {
		console.error("Error fetching medical record for pet: ", error);
		return NextResponse.json(
			{ error: "Error fetching medical record for pet." },
			{ status: 500 },
		);
	}
}

// DELETE: Medical record for a pet by id
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string; recordId: string }> },
) {
	const { user, userId } = await getSessionUserWithScope();
	if (!user) {
		// middleware will force login
		return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
	}

	const routeParams = await params;

	const parsedParams = RouteIdSchema.safeParse(routeParams);
	if (!parsedParams.success) return validationError(parsedParams.error);

	const { id, recordId } = parsedParams.data;

	try {
		const deletedRecord = await prisma.medicalRecord.update({
			where: {
				id: recordId,
				pet: {
					id,
					...(userId && { userId }),
				},
			},
			data: { isDeleted: true, deletedAt: new Date() },
		});

		return NextResponse.json({ data: deletedRecord }, { status: 200 });
	} catch (error) {
		return handlePrismaError(error, "Medical record", "deleting");
	}
}

// UPDATE: Medical record for a pet by id
export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string; recordId: string }> },
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

	const parsedParams = RouteIdSchema.safeParse(routeParams);
	const parsedBody = MedicalRecordUpdateServerSchema.safeParse(body);
	if (!parsedParams.success) return validationError(parsedParams.error);
	if (!parsedBody.success) return validationError(parsedBody.error);

	const { id, recordId } = parsedParams.data;

	const { recordType } = parsedBody.data;
	let data: Prisma.MedicalRecordUpdateInput | undefined = undefined;

	if (recordType === RecordType.ALLERGY) {
		const { allergyName, reactions, severity } = parsedBody.data;
		data = {
			allergy: {
				update: {
					...(allergyName && { allergyName }),
					...(reactions && { reactions }),
					...(severity && { severity }),
				},
			},
		};
	} else if (recordType === RecordType.VACCINE) {
		const { vaccineName, dateAdministered, nextDueDate } = parsedBody.data;
		data = {
			vaccine: {
				update: {
					...(vaccineName && { vaccineName }),
					...(dateAdministered && { dateAdministered }),
					...(nextDueDate && { nextDueDate }),
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
		const updatedRecord = await prisma.medicalRecord.update({
			where: {
				id: recordId,
				pet: {
					id,
					...(userId && { userId }),
				},
			},
			data,
			select: {
				id: true,
				recordType: true,
				createdAt: true,
				petId: true,
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
		});

		return NextResponse.json({ data: updatedRecord }, { status: 200 });
	} catch (error) {
		return handlePrismaError(error, "Medical record", "updating");
	}
}
