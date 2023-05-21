-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "hash" DROP DEFAULT;

-- CreateTable
CREATE TABLE "TransmissionLine" (
    "id" VARCHAR(11) NOT NULL DEFAULT nanoid(),
    "color" TEXT NOT NULL,

    CONSTRAINT "TransmissionLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pole" (
    "id" VARCHAR(11) NOT NULL DEFAULT nanoid(),
    "transmissionLineId" VARCHAR(11) NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Pole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Line" (
    "id" VARCHAR(11) NOT NULL DEFAULT nanoid(),
    "transmissionLineId" VARCHAR(11) NOT NULL,
    "startPoleId" VARCHAR(11) NOT NULL,
    "endPoleId" VARCHAR(11) NOT NULL,

    CONSTRAINT "Line_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Pole" ADD CONSTRAINT "Pole_transmissionLineId_fkey" FOREIGN KEY ("transmissionLineId") REFERENCES "TransmissionLine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Line" ADD CONSTRAINT "Line_startPoleId_fkey" FOREIGN KEY ("startPoleId") REFERENCES "Pole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Line" ADD CONSTRAINT "Line_endPoleId_fkey" FOREIGN KEY ("endPoleId") REFERENCES "Pole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Line" ADD CONSTRAINT "Line_transmissionLineId_fkey" FOREIGN KEY ("transmissionLineId") REFERENCES "TransmissionLine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
