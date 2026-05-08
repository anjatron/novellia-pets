# Novellia Pets

MVP for Novellia Pets!

A pet medical records management platform.

Built as a fullstack take-home assessment for Novellia.

## AI Usage

- Copilot for autocomplete assistance in VSCode. Enabled once basic code structure was setup, otherwise it assumes too much and is noisy.
- Claude for debugging, usage guidance for Next.js / Prisma / CSS etc, code review.

## Tech Stack

The assessment allows for use of any stack, since it's a full stack application I took it as an opportunity to try Next.js (best way to learn is to build with it!). There was a learning curve but it was worth it to mirror a tech stack Novellia is using.
The overall build experience was a lot of fun.

- **Next.js 15**: full-stack React framework (App Router, no server side components)
- **Prisma 7 + SQLite**: ORM with migrations, SQLite for local/demo persistence
- **shadcn/ui**: component library built on Radix UI for ease of use
- **Zod**: schema validation shared between client and server
- **TanStack Table**: headless table with server-side filtering and pagination for ease of use
- **date-fns**: date formatting and manipulation
- **Sonner**: toast notifications
- **Docker**: containerized demo environment

Note: prettier and eslint are setup in this project.

## Run Application

### System Requirements

- Docker installed and running

### Demo (recommended):

```
make setup
make run
```

Open app -> [http://localhost:3000](http://localhost:3000)

### Development mode:

```
cp .env.example .env
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Note: Requires Node v22

Open app -> [http://localhost:3000](http://localhost:3000)

## Mock Login

Authentication is mocked for demo purposes. I wanted to show the different user experience based on the two roles mentioned in the assessment.
On the login page, select one of three seeded users:

| User           | Role  | Access                     |
| -------------- | ----- | -------------------------- |
| Leia Organa    | Admin | Dashboard stats + all pets |
| Anja Draskovic | User  | Own pets only              |
| Han Solo       | User  | Own pets only              |

In production this would be replaced with NextAuth.js —> the session cookie pattern and API route scoping logic remain identical.

## Project Structure

| Directory     | Purpose                                             |
| ------------- | --------------------------------------------------- |
| `app/api`     | Server-side REST API route handlers                 |
| `app/(pages)` | Client-side React pages                             |
| `components`  | Reusable React components                           |
| `lib`         | Client-side utilities and hooks                     |
| `server`      | Server-side utilities (Prisma, session, validation) |
| `types`       | Shared TypeScript types and Zod schemas             |
| `prisma`      | Schema definitions and migrations                   |

## Features

- Pet management: create, view, edit, soft delete
- Medical records: vaccines and allergies per pet
- Dashboard: admin-only stats with independent loading per card
- Search & filter: server-side search by name, filter by animal type
- Vaccine status badges: overdue and due-soon indicators on pet list
- Birthday indicators: upcoming pet birthdays surfaced in the list
- Mock role-based access: admin vs user scoping across all API routes
- Pagination: server-side pagination on pets and medical records

## Future Features

**Auth**

- Replace mock login with NextAuth.js

**Vaccine Catalog**

- Structured `VaccineCatalog` table with vaccine schedules per animal type
- Replace manual `nextDueDate` entry with computed due dates
- Add `completedAt` to `VaccineRecord` for audit tracking, allow users to manually check this

**Admin**

Note: I took the Admin role as a full administrator, allowing for editing + deleting of other users pets.

- Pet management on behalf of users - allow admin to select an owner for the pet
- User management dashboard

## Architecture Notes

- **No server components**: all data fetching is client-side via hooks calling REST API routes. This was a deliberate choice to keep a clear client/server boundary and demonstrate a traditional API architecture.
- **Soft deletes**: records are never hard deleted. `isDeleted` + `deletedAt` fields preserve audit history, this is relevant for health data (nothing should be _really_ deleted).
- **Extensible medical records**: new record types follow a documented pattern: new Zod schema, enum value, form component, table component, registry entry.
- **Server-side filtering**: search, filter, and pagination all hit the server.
