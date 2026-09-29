-- Remove the retired admin role without deleting the account data.
UPDATE "User" SET "role" = 'EXAMINER' WHERE "role" = 'ADMIN';

-- Existing courses receive a department before the application starts enforcing it.
ALTER TABLE "Course" ADD COLUMN "department" TEXT NOT NULL DEFAULT 'Unassigned';
UPDATE "Course" SET "department" = 'Computer Science' WHERE "code" = 'CSC401';
