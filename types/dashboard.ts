export interface TotalPetsStats {
	totalPets: number;
}

export interface PetsByTypeStats {
	animalType: string;
	_count: {
		animalType: number;
	};
}

export interface UpcomingVaccineStats {
	id: string;
	vaccineName: string;
	nextDueDate: string;
	dateAdministered: string;
	record: {
		id: string;
		recordType: string;
		pet: {
			id: string;
			name: string;
			animalType: string;
		};
	};
}

export interface OverdueVaccineStats {
	id: string;
	vaccineName: string;
	nextDueDate: string;
	dateAdministered: string;
	record: {
		id: string;
		recordType: string;
		pet: {
			id: string;
			name: string;
			animalType: string;
		};
	};
}
