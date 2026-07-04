"use client";

import React, { useState, useMemo, useCallback, useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { CUSTOM_ROOM_TYPES, LIGHTING_OPTIONS, FLOORING_OPTIONS } from "@/lib/validations/lead";
import { generateRooms, createDefaultRoom, RoomData } from "@/lib/estimation";
import { Copy, Plus, Trash2, Ruler, LayoutGrid, Bed, Bath, Home, Sofa, UtensilsCrossed, SquareStack } from "lucide-react";
import type { EstimationFormValues } from "@/types/estimation-form";

interface StepRoomsProps {
  form: UseFormReturn<EstimationFormValues>;
  onNext: () => void;
  onBack: () => void;
  configuration?: string;
  totalArea?: number;
}

// Room icon mapping
const ROOM_ICONS: Record<string, React.ReactNode> = {
  "Master Bedroom": <Bed className="w-5 h-5" />,
  "Bedroom": <Bed className="w-5 h-5" />,
  "Living Room": <Sofa className="w-5 h-5" />,
  "Dining": <UtensilsCrossed className="w-5 h-5" />,
  "Dining Room": <UtensilsCrossed className="w-5 h-5" />,
  "Kitchen": <UtensilsCrossed className="w-5 h-5" />,
  "Bathroom": <Bath className="w-5 h-5" />,
  "Balcony": <Home className="w-5 h-5" />,
};

const getRoomIcon = (name: string): React.ReactNode => {
  for (const [key, icon] of Object.entries(ROOM_ICONS)) {
    if (name.includes(key) || key.includes(name)) return icon;
  }
  return <LayoutGrid className="w-5 h-5" />;
};

interface RoomCardProps {
  room: RoomData;
  index: number;
  totalRooms: number;
  onUpdate: (index: number, field: string, value: number | string | boolean) => void;
  onRemove: (index: number) => void;
  onCopy: (index: number) => void;
  errors?: Record<string, string>;
}

function RoomCard({ room, index, totalRooms, onUpdate, onRemove, onCopy, errors }: RoomCardProps) {
  const isLengthWidth = room.dimensionMode === "LENGTH_WIDTH";

  const calcArea = useCallback(() => {
    if (isLengthWidth && room.length > 0 && room.width > 0) {
      return room.length * room.width;
    }
    return room.area;
  }, [isLengthWidth, room.length, room.width, room.area]);

  return (
    <Card className="border-2 border-border/50 hover:border-accent/30 transition-all shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-accent/5 to-transparent px-6 py-4 border-b border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
              {getRoomIcon(room.roomName)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {room.roomName || `Room ${index + 1}`}
              </h3>
              <p className="text-xs text-muted-foreground">
                {calcArea() > 0 ? `${calcArea()} sq ft` : "Dimensions not set"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {totalRooms > 1 && index > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onCopy(index)}
                className="text-muted-foreground hover:text-accent"
                title="Copy Previous Room"
              >
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </Button>
            )}
            {totalRooms > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemove(index)}
                className="text-destructive hover:text-destructive/80"
                title="Delete Room"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <CardContent className="p-6 space-y-6">
        {/* Room Name */}
        <div className="space-y-2">
          <Label className="text-base font-semibold">Room Name</Label>
          <Input
            value={room.roomName}
            onChange={(e) => onUpdate(index, "roomName", e.target.value)}
            placeholder="e.g., Master Bedroom"
            className="h-12 text-base font-medium"
          />
        </div>

        {/* Dimension Mode Toggle */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Room Dimensions</Label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onUpdate(index, "dimensionMode", "LENGTH_WIDTH")}
              className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all font-medium text-sm flex items-center justify-center gap-2 ${
                isLengthWidth
                  ? "border-accent bg-accent/10 text-accent shadow-sm"
                  : "border-border text-muted-foreground hover:border-accent/50"
              }`}
            >
              <Ruler className="w-4 h-4" />
              Option A: Length × Width
            </button>
            <button
              type="button"
              onClick={() => onUpdate(index, "dimensionMode", "TOTAL_AREA")}
              className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all font-medium text-sm flex items-center justify-center gap-2 ${
                !isLengthWidth
                  ? "border-accent bg-accent/10 text-accent shadow-sm"
                  : "border-border text-muted-foreground hover:border-accent/50"
              }`}
            >
              <SquareStack className="w-4 h-4" />
              Option B: Total Area
            </button>
          </div>
        </div>

        {/* Dimension Inputs */}
        {isLengthWidth ? (
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="font-medium">Length (ft)</Label>
              <Input
                type="number"
                min="0"
                step="0.5"
                value={room.length || ""}
                onChange={(e) => onUpdate(index, "length", parseFloat(e.target.value) || 0)}
                placeholder="12"
                className="h-12 text-lg font-medium"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-medium">Width (ft)</Label>
              <Input
                type="number"
                min="0"
                step="0.5"
                value={room.width || ""}
                onChange={(e) => onUpdate(index, "width", parseFloat(e.target.value) || 0)}
                placeholder="10"
                className="h-12 text-lg font-medium"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-medium">Height (ft)</Label>
              <Input
                type="number"
                min="0"
                step="0.5"
                value={room.height || ""}
                onChange={(e) => onUpdate(index, "height", parseFloat(e.target.value) || 0)}
                placeholder="9"
                className="h-12 text-lg font-medium"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Label className="font-medium">Room Area (sq ft)</Label>
            <Input
              type="number"
              min="0"
              step="1"
              value={room.area || ""}
              onChange={(e) => onUpdate(index, "area", parseFloat(e.target.value) || 0)}
              placeholder="168"
              className="h-12 text-lg font-medium"
            />
          </div>
        )}

        {/* Live Area Calculation */}
        {isLengthWidth && room.length > 0 && room.width > 0 && (
          <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
            <p className="text-sm font-medium text-accent">
              Room Area: <strong>{room.length} × {room.width} = {room.length * room.width} sq ft</strong>
            </p>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-border/50" />

        {/* Amenities Grid */}
        <div>
          <Label className="text-base font-semibold mb-3 block">Amenities & Finishes</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { key: "wardrobeNeeded" as const, label: "Wardrobe" },
                { key: "falseCeiling" as const, label: "False Ceiling" },
                { key: "tvUnit" as const, label: "TV Unit" },
                { key: "wallpaper" as const, label: "Wallpaper" },
                { key: "furnitureRequired" as const, label: "Furniture" },
              ].map((item) => (
                <div
                  key={item.key}
                  className={`p-3 rounded-lg border-2 transition-all cursor-pointer text-center ${
                    room[item.key]
                      ? "border-accent bg-accent/10"
                      : "border-border hover:border-accent/30"
                  }`}
                  onClick={() => onUpdate(index, item.key, !room[item.key])}
                >
                  <p className="text-sm font-medium mb-1">{item.label}</p>
                  <p className={`text-xs font-bold ${room[item.key] ? "text-accent" : "text-muted-foreground"}`}>
                    {room[item.key] ? "Yes" : "No"}
                  </p>
                </div>
              ))}
          </div>
        </div>

        {/* Lighting Type */}
        <div className="space-y-2">
          <Label className="font-medium">Lighting</Label>
          <div className="flex gap-2">
            {LIGHTING_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onUpdate(index, "lightingType", opt.value)}
                className={`flex-1 py-2 px-3 rounded-lg border-2 transition-all text-sm font-medium ${
                  room.lightingType === opt.value
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-muted-foreground hover:border-accent/50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Flooring Type */}
        <div className="space-y-2">
          <Label className="font-medium">Flooring</Label>
          <div className="flex gap-2">
            {FLOORING_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onUpdate(index, "flooringType", opt.value)}
                className={`flex-1 py-2 px-3 rounded-lg border-2 transition-all text-sm font-medium ${
                  room.flooringType === opt.value
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-muted-foreground hover:border-accent/50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Additional Notes */}
        <div className="space-y-2">
          <Label className="font-medium">Additional Notes</Label>
          <textarea
            value={room.additionalNotes}
            onChange={(e) => onUpdate(index, "additionalNotes", e.target.value)}
            placeholder="Any specific requirements or notes for this room..."
            className="w-full min-h-[80px] rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function StepRooms({ form, onNext, onBack, configuration, totalArea }: StepRoomsProps) {
  const rooms = form.watch("rooms.rooms") || [];
  const prevConfigRef = useRef<string | undefined>(configuration);

  // Auto-regenerate rooms when configuration changes
  React.useEffect(() => {
    if (prevConfigRef.current !== configuration) {
      prevConfigRef.current = configuration;
      const newRooms = generateRooms(configuration || "Custom");
      form.setValue("rooms.rooms", newRooms);
    }
  }, [configuration, form]);

  // Initialize rooms on first mount
  React.useEffect(() => {
    const currentRooms = form.getValues("rooms.rooms") || [];
    if (currentRooms.length === 0) {
      const newRooms = generateRooms(configuration || "Custom");
      form.setValue("rooms.rooms", newRooms);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateRoom = useCallback((index: number, field: string, value: number | string | boolean) => {
    const updated = [...rooms] as RoomData[];
    updated[index] = { ...updated[index], [field]: value as never };
    // Auto-calculate area when length/width changes
    if (field === "length" || field === "width") {
      const len = field === "length" ? (value as number) : updated[index].length;
      const wid = field === "width" ? (value as number) : updated[index].width;
      if (len > 0 && wid > 0) {
        updated[index].area = len * wid;
      }
    }
    form.setValue("rooms.rooms", updated);
  }, [rooms, form]);

  const removeRoom = useCallback((index: number) => {
    const updated = rooms.filter((_i: unknown, i: number) => i !== index);
    form.setValue("rooms.rooms", updated as RoomData[]);
  }, [rooms, form]);

  const addCustomRoom = useCallback(() => {
    const newRoom = { ...createDefaultRoom(), roomName: "Custom Room" };
    form.setValue("rooms.rooms", [...rooms, newRoom]);
  }, [rooms, form]);

  const addCustomRoomWithName = useCallback((name: string) => {
    const newRoom = { ...createDefaultRoom(), roomName: name };
    form.setValue("rooms.rooms", [...rooms, newRoom]);
  }, [rooms, form]);

  const copyPreviousRoom = useCallback((index: number) => {
    if (index > 0) {
      const prevRoom = rooms[index - 1];
      const updated = [...rooms] as RoomData[];
      updated[index] = { ...prevRoom, roomName: updated[index].roomName };
      form.setValue("rooms.rooms", updated);
    }
  }, [rooms, form]);

  const [showCustomDropdown, setShowCustomDropdown] = useState(false);

  // Live calculations
  const totalRoomsCount = rooms.length;
  const totalInteriorArea = useMemo(() => {
    return rooms.reduce((sum: number, room: RoomData) => {
      if (room.dimensionMode === "LENGTH_WIDTH" && room.length > 0 && room.width > 0) {
        return sum + room.length * room.width;
      }
      return sum + (room.area || 0);
    }, 0);
  }, [rooms]);

  const roomsCompleted = rooms.filter((room: RoomData) => {
    if (room.dimensionMode === "LENGTH_WIDTH") {
      return room.length > 0 && room.width > 0;
    }
    return room.area > 0;
  }).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate no room has 0 sq ft
    const invalidRooms = rooms.filter((room: RoomData) => {
      if (room.dimensionMode === "LENGTH_WIDTH") {
        return room.length <= 0 || room.width <= 0;
      }
      return room.area <= 0;
    });
    if (invalidRooms.length > 0) {
      return; // Let the form validation handle it
    }
    onNext();
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Room Configuration
          </h2>
          <p className="text-muted-foreground text-lg">
            Configure each room with dimensions and requirements.
          </p>
        </div>

        <div className="space-y-6">
          {rooms.map((room: RoomData, index: number) => (
            <RoomCard
              key={index}
              room={room}
              index={index}
              totalRooms={rooms.length}
              onUpdate={updateRoom}
              onRemove={removeRoom}
              onCopy={copyPreviousRoom}
            />
          ))}
        </div>

        {/* Add Custom Room Button */}
        <div className="relative">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCustomDropdown(!showCustomDropdown)}
              className="flex-1"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Custom Room
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={addCustomRoom}
              size="lg"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
          {showCustomDropdown && (
            <Card className="absolute z-10 mt-2 w-full shadow-xl border-accent/30">
              <CardContent className="p-3 max-h-60 overflow-y-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CUSTOM_ROOM_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        addCustomRoomWithName(type);
                        setShowCustomDropdown(false);
                      }}
                      className="p-2 text-sm rounded-lg border border-border hover:border-accent hover:bg-accent/5 transition-all text-left"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </form>
    </div>
  );
}