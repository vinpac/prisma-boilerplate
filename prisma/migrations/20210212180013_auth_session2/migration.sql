/*
  Warnings:

  - You are about to drop the column `hashedSessionToken` on the `AuthSession` table. All the data in the column will be lost.
  - Added the required column `hashedToken` to the `AuthSession` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AuthSession" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "expiresAt" DATETIME,
    "userId" INTEGER NOT NULL,
    "hashedToken" TEXT NOT NULL,
    "publicData" TEXT,
    "privateData" TEXT,
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AuthSession" ("id", "createdAt", "updatedAt", "expiresAt", "userId", "publicData", "privateData") SELECT "id", "createdAt", "updatedAt", "expiresAt", "userId", "publicData", "privateData" FROM "AuthSession";
DROP TABLE "AuthSession";
ALTER TABLE "new_AuthSession" RENAME TO "AuthSession";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
