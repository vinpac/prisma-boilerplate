/*
  Warnings:

  - You are about to drop the column `claimedAt` on the `PasswordRecoveryRequest` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PasswordRecoveryRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL,
    "invalidatedAt" DATETIME,
    "userId" INTEGER NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PasswordRecoveryRequest" ("id", "token", "createdAt", "expiresAt", "userId") SELECT "id", "token", "createdAt", "expiresAt", "userId" FROM "PasswordRecoveryRequest";
DROP TABLE "PasswordRecoveryRequest";
ALTER TABLE "new_PasswordRecoveryRequest" RENAME TO "PasswordRecoveryRequest";
CREATE UNIQUE INDEX "PasswordRecoveryRequest.token_unique" ON "PasswordRecoveryRequest"("token");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
