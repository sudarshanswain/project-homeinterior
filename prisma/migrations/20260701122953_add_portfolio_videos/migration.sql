/*
  Warnings:

  - Added the required column `updated_at` to the `portfolio_images` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO');

-- CreateEnum
CREATE TYPE "VideoType" AS ENUM ('UPLOAD', 'YOUTUBE', 'VIMEO');

-- AlterTable
ALTER TABLE "portfolio_images" ADD COLUMN     "file_size" INTEGER,
ADD COLUMN     "height" INTEGER,
ADD COLUMN     "mime_type" TEXT,
ADD COLUMN     "thumbnail" TEXT,
ADD COLUMN     "type" "MediaType" NOT NULL DEFAULT 'IMAGE',
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "width" INTEGER;

-- CreateTable
CREATE TABLE "portfolio_videos" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "type" "VideoType" NOT NULL DEFAULT 'UPLOAD',
    "url" TEXT NOT NULL,
    "thumbnail" TEXT,
    "title" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portfolio_videos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "portfolio_videos_project_id_sort_order_idx" ON "portfolio_videos"("project_id", "sort_order");

-- AddForeignKey
ALTER TABLE "portfolio_videos" ADD CONSTRAINT "portfolio_videos_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "portfolio_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
