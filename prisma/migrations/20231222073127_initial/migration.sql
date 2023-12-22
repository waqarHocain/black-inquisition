-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'COMPANY', 'ADMIN');

-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('fullTime', 'partTime', 'contract', 'temporary', 'volunteer', 'internship', 'other');

-- CreateEnum
CREATE TYPE "WorkplaceType" AS ENUM ('onSite', 'hybrid', 'remote');

-- CreateTable
CREATE TABLE "User" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "email" STRING NOT NULL,
    "name" STRING NOT NULL,
    "password" STRING NOT NULL,
    "bio" STRING NOT NULL,
    "photo" STRING,
    "phone" STRING,
    "active" BOOL NOT NULL DEFAULT false,
    "verified" BOOL NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "title" STRING NOT NULL,
    "company" STRING NOT NULL,
    "location" STRING NOT NULL,
    "description" STRING NOT NULL,
    "workplace" "WorkplaceType" NOT NULL,
    "type" "JobType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INT8 NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "jobId" INT8 NOT NULL,
    "accepted" BOOL NOT NULL DEFAULT false,
    "userId" INT8 NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "title" STRING NOT NULL,
    "body" STRING NOT NULL,
    "userId" INT8 NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReputalbeSource" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "name" STRING NOT NULL,
    "url" STRING,
    "userId" INT8 NOT NULL,

    CONSTRAINT "ReputalbeSource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReputalbeSource" ADD CONSTRAINT "ReputalbeSource_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
