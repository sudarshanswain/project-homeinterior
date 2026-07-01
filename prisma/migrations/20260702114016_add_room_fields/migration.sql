-- AlterTable
ALTER TABLE "rooms" ADD COLUMN     "additional_notes" TEXT,
ADD COLUMN     "dimension_mode" TEXT NOT NULL DEFAULT 'LENGTH_WIDTH',
ADD COLUMN     "flooring_type" TEXT NOT NULL DEFAULT 'TILES',
ADD COLUMN     "furniture_required" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lighting_type" TEXT NOT NULL DEFAULT 'BASIC',
ADD COLUMN     "tv_unit" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "wallpaper" BOOLEAN NOT NULL DEFAULT false;
