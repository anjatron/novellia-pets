import "dotenv/config";
import {
	PrismaClient,
	RecordType,
	Severity,
	Prisma,
	UserRole,
	AnimalType,
} from "@/app/generated/prisma";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
	url: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
	adapter,
});

const userData: Prisma.UserCreateInput[] = [
	{
		firstName: "Leia",
		lastName: "Organa",
		role: UserRole.ADMIN,
	},
	{
		firstName: "Anja",
		lastName: "Draskovic",
		pets: {
			create: [
				{
					name: "Loki",
					animalType: AnimalType.CAT,
					dateOfBirth: new Date("2018-04-01"),
					records: {
						create: [
							{
								recordType: RecordType.VACCINE,
								vaccine: {
									create: {
										vaccineName: "Rabies",
										dateAdministered: new Date("2025-05-06"),
										nextDueDate: new Date("2026-05-06"), // next up
									},
								},
							},
						],
					},
				},
				{
					name: "Cleo",
					animalType: AnimalType.DOG,
					dateOfBirth: new Date("2018-02-02"),
					records: {
						create: [
							{
								recordType: RecordType.VACCINE,
								vaccine: {
									create: {
										vaccineName: "Rabies",
										dateAdministered: new Date("2026-01-03"), // up to date
										nextDueDate: new Date("2027-01-03"),
									},
								},
							},
							{
								recordType: RecordType.ALLERGY,
								allergy: {
									create: {
										allergyName: "Salmon",
										severity: Severity.SEVERE,
										reactions: "hives, vomiting",
									},
								},
							},
						],
					},
				},
			],
		},
	},
	{
		firstName: "Han",
		lastName: "Solo",
		pets: {
			create: [
				{
					name: "Pepper",
					animalType: AnimalType.RABBIT,
					dateOfBirth: new Date("2020-05-12"),
					records: {
						create: {
							recordType: RecordType.ALLERGY,
							allergy: {
								create: {
									allergyName: "Hay",
									severity: Severity.MILD,
									reactions: "sneezing",
								},
							},
						},
					},
				},
				{
					name: "Kiwi",
					animalType: AnimalType.BIRD,
					dateOfBirth: new Date("2015-12-15"),
					records: {
						create: {
							recordType: RecordType.VACCINE,
							vaccine: {
								create: {
									vaccineName: "Avian Polyomavirus",
									dateAdministered: new Date("2024-02-10"),
									nextDueDate: new Date("2025-02-10"), // overdue
								},
							},
						},
					},
				},
			],
		},
	},
];

export async function main() {
	const existingUsers = await prisma.user.count();
	if (existingUsers > 0) {
		console.log("Database already seeded! Skipping.");
		return;
	}

	for (const user of userData) {
		const createdUser = await prisma.user.create({ data: user });
		console.log("Seeded: ", createdUser.firstName, createdUser.id);
	}
}

main()
	.then(async () => {
		await prisma.$disconnect();
		process.exit(0);
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
