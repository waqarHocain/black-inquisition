/*
  Warnings:

  - Added the required column `status` to the `FriendRequest` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "FriendRequest" ADD COLUMN     "status" "RequestStatus" NOT NULL;
