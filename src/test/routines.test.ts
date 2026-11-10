import { describe, expect, it } from "vitest";

import {
  ACTIVITIES,
  EMERGENCY_RESETS,
  ENERGIES,
  ENVS,
  generateRoutine,
} from "@/lib/routines";

const titles = ACTIVITIES.map((a) => a.title);

describe("Activity database", () => {
  it("includes every new activity from the brief", () => {
    for (const t of [
      "Heavy Laundry Basket Push",
      "Log Carrier Relay",
      "Glow-Stick Dark Expedition",
      "Pine Needle & Bark Scavenger Trail",
      "Hallway Kurahousut Speed Challenge",
      "Raindrop Body Scan Meditation",
      "Midnight Sun Eye-Mask Igloo",
    ]) {
      expect(titles).toContain(t);
    }
  });

  it("keeps every activity's weather/energy tags valid with both age scripts", () => {
    const envIds = new Set(ENVS.map((e) => e.id));
    const energyIds = new Set(ENERGIES.map((e) => e.id));
    for (const a of ACTIVITIES) {
      expect(a.envs.length).toBeGreaterThan(0);
      expect(a.energies.length).toBeGreaterThan(0);
      for (const e of a.envs) expect(envIds.has(e)).toBe(true);
      for (const e of a.energies) expect(energyIds.has(e)).toBe(true);
      expect(a.steps.toddler.length).toBeGreaterThan(0);
      expect(a.steps.preschool.length).toBeGreaterThan(0);
      expect(a.effort).toBeGreaterThanOrEqual(1);
      expect(a.effort).toBeLessThanOrEqual(5);
      expect(a.rating).toBeGreaterThanOrEqual(1);
      expect(a.rating).toBeLessThanOrEqual(5);
    }
  });

  it("returns one motor, sensory and cooldown card for every mood and weather", () => {
    for (const energy of ENERGIES) {
      for (const env of ENVS) {
        const routine = generateRoutine(energy.id, env.id, 0);
        expect(routine.map((a) => a.slot)).toEqual(["motor", "sensory", "cooldown"]);
      }
    }
  });
});

describe("Emergency Tantrum Tamers", () => {
  it("offers the four brief resets with a full 3-minute step timeline", () => {
    expect(EMERGENCY_RESETS.map((r) => r.title)).toEqual([
      "Ice Cube Hand Squeeze",
      "Burrito Blanket Roll & Squeeze",
      "Deep Wall Push Challenge",
      "Crunchy Ice / Carrot Crunch",
    ]);
    for (const r of EMERGENCY_RESETS) {
      expect(r.steps.map((s) => s.at)).toEqual([0, 45, 90, 135]);
      for (const s of r.steps) expect(s.text.length).toBeGreaterThan(0);
    }
  });
});
