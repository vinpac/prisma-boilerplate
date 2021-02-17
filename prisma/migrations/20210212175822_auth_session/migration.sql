/*
  Warnings:

  - Added the required column `updatedAt` to the `api_AppPath` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `api_SendGridEmailTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "AuthSession" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "expiresAt" DATETIME,
    "userId" INTEGER NOT NULL,
    "hashedSessionToken" TEXT NOT NULL,
    "publicData" TEXT,
    "privateData" TEXT,
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_api_AppPath" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_api_AppPath" ("id", "name", "value") SELECT "id", "name", "value" FROM "api_AppPath";
DROP TABLE "api_AppPath";
ALTER TABLE "new_api_AppPath" RENAME TO "api_AppPath";
CREATE UNIQUE INDEX "api_AppPath.name_unique" ON "api_AppPath"("name");
CREATE TABLE "new_api_SendGridEmailTemplate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_api_SendGridEmailTemplate" ("id", "name", "templateId") SELECT "id", "name", "templateId" FROM "api_SendGridEmailTemplate";
DROP TABLE "api_SendGridEmailTemplate";
ALTER TABLE "new_api_SendGridEmailTemplate" RENAME TO "api_SendGridEmailTemplate";
CREATE UNIQUE INDEX "api_SendGridEmailTemplate.name_unique" ON "api_SendGridEmailTemplate"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
