/*
  Warnings:

  - You are about to drop the column `contact_address` on the `site_settings` table. All the data in the column will be lost.
  - You are about to drop the column `facebook_url` on the `site_settings` table. All the data in the column will be lost.
  - You are about to drop the column `font_body` on the `site_settings` table. All the data in the column will be lost.
  - You are about to drop the column `font_heading` on the `site_settings` table. All the data in the column will be lost.
  - You are about to drop the column `google_maps_url` on the `site_settings` table. All the data in the column will be lost.
  - You are about to drop the column `instagram_url` on the `site_settings` table. All the data in the column will be lost.
  - You are about to drop the column `linkedin_url` on the `site_settings` table. All the data in the column will be lost.
  - You are about to drop the column `og_image` on the `site_settings` table. All the data in the column will be lost.
  - You are about to drop the column `pinterest_url` on the `site_settings` table. All the data in the column will be lost.
  - You are about to drop the column `twitter_url` on the `site_settings` table. All the data in the column will be lost.
  - You are about to drop the column `youtube_url` on the `site_settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "site_settings" DROP COLUMN "contact_address",
DROP COLUMN "facebook_url",
DROP COLUMN "font_body",
DROP COLUMN "font_heading",
DROP COLUMN "google_maps_url",
DROP COLUMN "instagram_url",
DROP COLUMN "linkedin_url",
DROP COLUMN "og_image",
DROP COLUMN "pinterest_url",
DROP COLUMN "twitter_url",
DROP COLUMN "youtube_url",
ADD COLUMN     "address_line1" TEXT,
ADD COLUMN     "address_line2" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "copyright_text" TEXT,
ADD COLUMN     "country" TEXT NOT NULL DEFAULT 'India',
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'INR',
ADD COLUMN     "default_language" TEXT NOT NULL DEFAULT 'en',
ADD COLUMN     "facebook" TEXT,
ADD COLUMN     "facebook_pixel_id" TEXT,
ADD COLUMN     "google_analytics_id" TEXT,
ADD COLUMN     "google_tag_manager_id" TEXT,
ADD COLUMN     "instagram" TEXT,
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "maintenance_mode" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "meta_description" TEXT,
ADD COLUMN     "meta_keywords" TEXT,
ADD COLUMN     "meta_title" TEXT,
ADD COLUMN     "pinterest" TEXT,
ADD COLUMN     "postal_code" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
ADD COLUMN     "twitter" TEXT,
ADD COLUMN     "youtube" TEXT,
ALTER COLUMN "id" SET DEFAULT 'default';
