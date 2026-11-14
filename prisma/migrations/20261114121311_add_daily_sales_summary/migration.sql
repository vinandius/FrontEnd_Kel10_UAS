-- CreateTable
CREATE TABLE "DailySalesSummary" (
    "id" SERIAL NOT NULL,
    "summaryDate" DATE NOT NULL,
    "transactionCount" INTEGER NOT NULL,
    "itemCount" INTEGER NOT NULL,
    "totalRevenue" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailySalesSummary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DailySalesSummary_summaryDate_key" ON "DailySalesSummary"("summaryDate");

-- CreateIndex
CREATE INDEX "DailySalesSummary_summaryDate_idx" ON "DailySalesSummary"("summaryDate");
