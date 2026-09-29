ALTER TABLE "Exam" ADD COLUMN "closesAt" DATETIME NOT NULL DEFAULT '2099-01-01 00:00:00';
UPDATE "Exam" SET "closesAt" = datetime("scheduledAt", '+' || "durationMinutes" || ' minutes') WHERE "closesAt" = '2099-01-01 00:00:00';
