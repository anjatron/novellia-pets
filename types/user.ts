import { UserRole } from "./enums";

export interface User {
	id: string;
	firstName: string;
	lastName: string;
	role: UserRole;
}
