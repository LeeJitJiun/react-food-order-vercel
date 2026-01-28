/*
  Warnings:

  - The values [STRIPE,CASH] on the enum `PaymentMethod` will be removed. If these variants are still used in the database, this will fail.

*/

-- Update existing data: STRIPE -> CARD, CASH -> CARD (since we're removing cash)
UPDATE "Payment" SET "method" = 'STRIPE' WHERE "method" = 'CASH';

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentMethod_new" AS ENUM ('CARD', 'FPX');
ALTER TABLE "Payment" ALTER COLUMN "method" TYPE "PaymentMethod_new" USING (
  CASE 
    WHEN "method"::text = 'STRIPE' THEN 'CARD'::"PaymentMethod_new"
    ELSE 'CARD'::"PaymentMethod_new"
  END
);
ALTER TYPE "PaymentMethod" RENAME TO "PaymentMethod_old";
ALTER TYPE "PaymentMethod_new" RENAME TO "PaymentMethod";
DROP TYPE "PaymentMethod_old";
COMMIT;
