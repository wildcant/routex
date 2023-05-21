-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "hash" DROP DEFAULT;

-- CreateTable
CREATE TABLE "TransmissionLine" (
    "id" VARCHAR(11) NOT NULL DEFAULT nanoid(),
    "geojson" JSONB NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "TransmissionLine_pkey" PRIMARY KEY ("id")
);
