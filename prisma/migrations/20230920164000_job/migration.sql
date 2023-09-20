-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('fullTime', 'partTime', 'contract', 'temporary', 'volunteer', 'internship', 'other');

-- CreateEnum
CREATE TYPE "WorkplaceType" AS ENUM ('onSite', 'hybrid', 'remote');

-- CreateTable
CREATE TABLE "Job" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "title" STRING NOT NULL,
    "company" STRING NOT NULL,
    "location" STRING NOT NULL,
    "description" STRING NOT NULL,
    "workplace" "WorkplaceType" NOT NULL,
    "type" "JobType" NOT NULL,
    "companyId" INT8 NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
