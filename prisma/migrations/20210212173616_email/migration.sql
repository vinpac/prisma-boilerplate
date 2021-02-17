/*
  Warnings:

  - You are about to drop the column `email` on the `EmailConfirmationRequest` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EmailConfirmationRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token" TEXT NOT NULL,
    "confirmedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_EmailConfirmationRequest" ("id", "token", "confirmedAt", "createdAt", "updatedAt", "userId") SELECT "id", "token", "confirmedAt", "createdAt", "updatedAt", "userId" FROM "EmailConfirmationRequest";
DROP TABLE "EmailConfirmationRequest";
ALTER TABLE "new_EmailConfirmationRequest" RENAME TO "EmailConfirmationRequest";
CREATE UNIQUE INDEX "EmailConfirmationRequest.token_unique" ON "EmailConfirmationRequest"("token");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
