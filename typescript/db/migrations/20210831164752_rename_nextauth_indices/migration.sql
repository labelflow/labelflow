-- RenameIndex
ALTER INDEX "Account.providerId_providerAccountId_unique" RENAME TO "Account.providerId_providerAccountId";

-- RenameIndex
ALTER INDEX "VerificationRequest.identifier_token_unique" RENAME TO "VerificationRequest.identifier_token";
