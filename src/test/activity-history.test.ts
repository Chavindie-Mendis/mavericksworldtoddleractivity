import { describe, it, expect } from "vitest";
import { validateVideo, MAX_VIDEO_BYTES, VIDEO_SIZE_ERROR, energyPoints, filterHistory, type Completion } from "@/lib/activity-history";
import { generateRoutine } from "@/lib/routines";

function entry(slot: "motor" | "cooldown", stars = 3): Completion {
  const activity = generateRoutine("zoomies", "kaamos", 0).find((a) => a.slot === slot);
  if (!activity) throw new Error("Activity missing");
  return { id: slot, owner: "demo", activity, age: "toddler", energy: "zoomies", env: "kaamos", completedAt: "2026-11-11T05:00:00Z", stars, notes: "Loved it" };
}

describe("Activity history rules", () => {
  it("allows exactly 15 MB and rejects larger clips", () => {
    expect(MAX_VIDEO_BYTES).toBe(15 * 1024 * 1024);
    expect(validateVideo({ size: 15 * 1024 * 1024, type: "video/mp4" })).toBeNull();
    expect(validateVideo({ size: 15 * 1024 * 1024 + 1, type: "video/mp4" })).toBe(VIDEO_SIZE_ERROR);
  });
  it("rejects non-video files", () => {
    expect(validateVideo({ size: 10, type: "image/png" })).not.toBeNull();
  });
  it("counts energy ratings but not cooldown calm ratings", () => {
    expect(energyPoints([entry("motor"), entry("cooldown")])).toBe(5);
  });
  it("searches notes and filters completed activity ratings", () => {
    expect(filterHistory([entry("motor", 5), entry("cooldown", 2)], "loved", "5").map((e) => e.id)).toEqual(["motor"]);
    expect(filterHistory([entry("motor")], "missing", "all")).toEqual([]);
  });
});