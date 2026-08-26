-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- Preserve messages created before conversations existed.
INSERT INTO "Conversation" ("id", "createdAt", "updatedAt")
VALUES ('legacy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

-- Add nullable columns first so existing installations can be backfilled safely.
ALTER TABLE "Message" ADD COLUMN "conversationId" TEXT;
ALTER TABLE "Message" ADD COLUMN "clientMessageId" TEXT;

UPDATE "Message"
SET
    "conversationId" = 'legacy',
    "clientMessageId" = 'legacy-' || "id"::TEXT
WHERE "conversationId" IS NULL OR "clientMessageId" IS NULL;

ALTER TABLE "Message"
    ALTER COLUMN "conversationId" SET NOT NULL,
    ALTER COLUMN "clientMessageId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Message_conversationId_clientMessageId_key" ON "Message"("conversationId", "clientMessageId");

-- CreateIndex
CREATE INDEX "Message_conversationId_createdAt_idx" ON "Message"("conversationId", "createdAt");

-- AddForeignKey
ALTER TABLE "Message"
    ADD CONSTRAINT "Message_conversationId_fkey"
    FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
