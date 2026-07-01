// ─── Room Generation Utility ────────────────────────────────────────────────
// Reusable function to generate rooms based on configuration

import { DEFAULT_ROOMS_BY_CONFIG } from "@/lib/validations/lead";

export interface RoomData {
  roomName: string;
  length: number;
  width: number;
  height: number;
  area: number;
  dimensionMode: "LENGTH_WIDTH" | "TOTAL_AREA";
  wardrobeNeeded: boolean;
  falseCeiling: boolean;
  tvUnit: boolean;
  wallpaper: boolean;
  lighting: boolean;
  painting: boolean;
  flooring: boolean;
  lightingType: "BASIC" | "PREMIUM" | "LUXURY";
  flooringType: "TILES" | "WOOD" | "MARBLE" | "VINYL";
  furnitureRequired: boolean;
  additionalNotes: string;
  remarks: string;
}

export function createDefaultRoom(): RoomData {
  return {
    roomName: "",
    length: 0,
    width: 0,
    height: 0,
    area: 0,
    dimensionMode: "LENGTH_WIDTH",
    wardrobeNeeded: false,
    falseCeiling: false,
    tvUnit: false,
    wallpaper: false,
    lighting: false,
    painting: false,
    flooring: false,
    lightingType: "BASIC",
    flooringType: "TILES",
    furnitureRequired: false,
    additionalNotes: "",
    remarks: "",
  };
}

export function generateRooms(configuration: string): RoomData[] {
  const configKey = configuration || "Custom";
  const roomNames = DEFAULT_ROOMS_BY_CONFIG[configKey] || DEFAULT_ROOMS_BY_CONFIG["Custom"];

  if (roomNames.length === 0) {
    // Villa or empty config - return one empty room
    return [createDefaultRoom()];
  }

  return roomNames.map((name) => ({
    ...createDefaultRoom(),
    roomName: name,
  }));
}