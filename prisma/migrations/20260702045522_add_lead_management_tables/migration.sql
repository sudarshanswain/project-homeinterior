/*
  Warnings:

  - You are about to drop the column `budget` on the `leads` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `leads` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `leads` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `leads` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `leads` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `leads` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `leads` table. All the data in the column will be lost.
  - You are about to drop the column `property_type` on the `leads` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[lead_number]` on the table `leads` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `customer_id` to the `leads` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lead_number` to the `leads` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('APARTMENT', 'VILLA', 'INDEPENDENT_HOUSE', 'COMMERCIAL', 'OFFICE', 'RETAIL', 'RESTAURANT', 'HOTEL');

-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('READY_TO_MOVE', 'UNDER_CONSTRUCTION', 'RENOVATION');

-- CreateEnum
CREATE TYPE "VendorAssignStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED');

-- AlterTable
ALTER TABLE "leads" DROP COLUMN "budget",
DROP COLUMN "city",
DROP COLUMN "email",
DROP COLUMN "first_name",
DROP COLUMN "last_name",
DROP COLUMN "message",
DROP COLUMN "phone",
DROP COLUMN "property_type",
ADD COLUMN     "converted_at" TIMESTAMP(3),
ADD COLUMN     "customer_id" TEXT NOT NULL,
ADD COLUMN     "estimated_value" DECIMAL(12,2),
ADD COLUMN     "follow_up_date" TIMESTAMP(3),
ADD COLUMN     "lead_number" TEXT NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "priority" TEXT NOT NULL DEFAULT 'MEDIUM';

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "lead_id" TEXT;

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "full_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "whatsapp" TEXT,
    "email" TEXT NOT NULL,
    "city" TEXT,
    "state" TEXT,
    "preferred_time" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properties" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "lead_id" TEXT,
    "propertyType" "PropertyType" NOT NULL,
    "configuration" TEXT,
    "total_area" INTEGER NOT NULL,
    "status" "PropertyStatus" NOT NULL DEFAULT 'READY_TO_MOVE',
    "expected_possession" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rooms" (
    "id" TEXT NOT NULL,
    "property_id" TEXT NOT NULL,
    "room_name" TEXT NOT NULL,
    "length" DECIMAL(10,2),
    "width" DECIMAL(10,2),
    "height" DECIMAL(10,2),
    "area" DECIMAL(10,2),
    "wardrobe_needed" BOOLEAN NOT NULL DEFAULT false,
    "false_ceiling" BOOLEAN NOT NULL DEFAULT false,
    "lighting" BOOLEAN NOT NULL DEFAULT false,
    "painting" BOOLEAN NOT NULL DEFAULT false,
    "flooring" BOOLEAN NOT NULL DEFAULT false,
    "remarks" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requirements" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "services" JSONB NOT NULL DEFAULT '[]',
    "design_style" TEXT,
    "inspiration_urls" JSONB DEFAULT '[]',
    "budget_min" DECIMAL(12,2),
    "budget_max" DECIMAL(12,2),
    "budget_custom" DECIMAL(12,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "requirements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_attachments" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_type" TEXT,
    "file_size" INTEGER,
    "category" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lead_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_assignments" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "vendor_id" TEXT NOT NULL,
    "vendor_name" TEXT NOT NULL,
    "vendor_email" TEXT NOT NULL,
    "vendor_phone" TEXT NOT NULL,
    "status" "VendorAssignStatus" NOT NULL DEFAULT 'PENDING',
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assigned_by_id" TEXT NOT NULL,

    CONSTRAINT "vendor_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_quotations" (
    "id" TEXT NOT NULL,
    "vendor_assignment_id" TEXT NOT NULL,
    "estimated_cost" DECIMAL(12,2) NOT NULL,
    "timeline" TEXT,
    "remarks" TEXT,
    "quotation_pdf" TEXT,
    "status" "QuotationStatus" NOT NULL DEFAULT 'DRAFT',
    "submitted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendor_quotations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_status_history" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "user_id" TEXT,
    "fromStatus" "LeadStatus",
    "toStatus" "LeadStatus" NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lead_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_user_id_key" ON "customers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "customers_email_key" ON "customers"("email");

-- CreateIndex
CREATE INDEX "customers_email_idx" ON "customers"("email");

-- CreateIndex
CREATE INDEX "customers_phone_idx" ON "customers"("phone");

-- CreateIndex
CREATE INDEX "properties_customer_id_idx" ON "properties"("customer_id");

-- CreateIndex
CREATE INDEX "properties_lead_id_idx" ON "properties"("lead_id");

-- CreateIndex
CREATE UNIQUE INDEX "properties_lead_id_key" ON "properties"("lead_id");

-- CreateIndex
CREATE INDEX "rooms_property_id_idx" ON "rooms"("property_id");

-- CreateIndex
CREATE UNIQUE INDEX "requirements_lead_id_key" ON "requirements"("lead_id");

-- CreateIndex
CREATE INDEX "requirements_lead_id_idx" ON "requirements"("lead_id");

-- CreateIndex
CREATE INDEX "lead_attachments_lead_id_idx" ON "lead_attachments"("lead_id");

-- CreateIndex
CREATE INDEX "vendor_assignments_lead_id_idx" ON "vendor_assignments"("lead_id");

-- CreateIndex
CREATE INDEX "vendor_assignments_vendor_id_idx" ON "vendor_assignments"("vendor_id");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_assignments_lead_id_vendor_email_key" ON "vendor_assignments"("lead_id", "vendor_email");

-- CreateIndex
CREATE INDEX "vendor_quotations_vendor_assignment_id_idx" ON "vendor_quotations"("vendor_assignment_id");

-- CreateIndex
CREATE INDEX "vendor_quotations_status_idx" ON "vendor_quotations"("status");

-- CreateIndex
CREATE INDEX "lead_status_history_lead_id_idx" ON "lead_status_history"("lead_id");

-- CreateIndex
CREATE INDEX "lead_status_history_created_at_idx" ON "lead_status_history"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "leads_lead_number_key" ON "leads"("lead_number");

-- CreateIndex
CREATE INDEX "leads_lead_number_idx" ON "leads"("lead_number");

-- CreateIndex
CREATE INDEX "leads_customer_id_idx" ON "leads"("customer_id");

-- CreateIndex
CREATE INDEX "projects_lead_id_idx" ON "projects"("lead_id");

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requirements" ADD CONSTRAINT "requirements_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_attachments" ADD CONSTRAINT "lead_attachments_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_assignments" ADD CONSTRAINT "vendor_assignments_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_quotations" ADD CONSTRAINT "vendor_quotations_vendor_assignment_id_fkey" FOREIGN KEY ("vendor_assignment_id") REFERENCES "vendor_assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_status_history" ADD CONSTRAINT "lead_status_history_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
