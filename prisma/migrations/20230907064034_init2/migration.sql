-- CreateTable
CREATE TABLE "logs" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "level" SMALLINT DEFAULT 6,
    "message" TEXT DEFAULT '',
    "json" JSONB,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);
