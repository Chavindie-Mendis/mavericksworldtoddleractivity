export type Age = "toddler" | "preschool";
export type Energy = "zoomies" | "overstimulated" | "winddown" | "fatigue";
export type Env = "kaamos" | "kurakeli" | "pakkanen" | "livingroom";
export type Slot = "motor" | "sensory" | "cooldown";

export const AGES: { id: Age; label: string }[] = [
  { id: "toddler", label: "Ages 1–3 (Toddler)" },
  { id: "preschool", label: "Ages 4–6 (Preschool)" },
];
export const ENERGIES: { id: Energy; label: string }[] = [
  { id: "zoomies", label: "🔥 High Zoomies / Hyperactive" },
  { id: "overstimulated", label: "🌀 Overstimulated / Meltdown Risk" },
  { id: "winddown", label: "🌙 Pre-Bed Wind Down" },
  { id: "fatigue", label: "💤 Post-Preschool Fatigue" },
];
export const ENVS: { id: Env; label: string }[] = [
  { id: "kaamos", label: "❄️ Indoor Winter / Kaamos" },
  { id: "kurakeli", label: "🌧️ Wet Outdoor / Kurakeli" },
  { id: "pakkanen", label: "🧊 Sub-Zero Quick Burn / Pakkanen" },
  { id: "livingroom", label: "🏠 Living Room Space" },
];

export const SLOT_LABEL: Record<Slot, string> = {
  motor: "Heavy Work / Gross Motor",
  sensory: "Sensory / Tactile Quest",
  cooldown: "Finnish ECEC Cool-Down",
};

export interface Activity {
  slot: Slot;
  title: string;
  icon: string;
  steps: Record<Age, string>;
  benefit: string;
  effort: number;
  /** energy burn for motor/sensory, calm for cooldown */
  rating: number;
  prep: string;
  envs: Env[];
  energies: Energy[];
}

const A: Activity[] = [
  { slot: "motor", title: "Pillow Mountain Avalanche", icon: "⛰️", benefit: "Proprioceptive Heavy Work", effort: 2, rating: 5, prep: "2 Mins", envs: ["livingroom", "kaamos"], energies: ["zoomies", "fatigue"],
    steps: { toddler: "Pile sofa cushions into a soft mountain and help your child climb to the top. On 'avalanche!', they tumble down and push the pillows back into a pile.", preschool: "Have your child build their own pillow mountain, then climb and crash into it on a countdown from five. Time how fast they can rebuild it for round two." } },
  { slot: "motor", title: "Indoor Ninja Obstacle Quest", icon: "🥷", benefit: "Motor Planning", effort: 3, rating: 5, prep: "5 Mins", envs: ["kaamos", "livingroom"], energies: ["zoomies"],
    steps: { toddler: "Lay out a short path: crawl under a chair, step over a broom, and hop onto a cushion. Walk it together first, then cheer them through it solo.", preschool: "Set a 6-station course with tunnels, balance tape lines and a 'lava' floor. Let them invent a new station after each successful run." } },
  { slot: "motor", title: "Puddle Jump Challenge", icon: "🌧️", benefit: "Vestibular Input", effort: 2, rating: 5, prep: "Zero Prep", envs: ["kurakeli"], energies: ["zoomies", "fatigue", "overstimulated"],
    steps: { toddler: "In rain gear, find the biggest puddle and hold hands for two-footed jumps. Count each splash out loud together.", preschool: "Challenge them to jump puddle-to-puddle without touching dry ground. Measure the biggest splash with a stick for bragging rights." } },
  { slot: "motor", title: "Snow Shovel Heavy Haul", icon: "🧊", benefit: "Proprioceptive Heavy Work", effort: 2, rating: 4, prep: "2 Mins", envs: ["pakkanen"], energies: ["zoomies", "overstimulated", "fatigue"],
    steps: { toddler: "Bundle up and give them a small shovel to move snow into a bucket for 10 minutes. Pull the full bucket together on a sled back to the door.", preschool: "Build a snow wall by shovelling and packing snow for 10 minutes. Then pull a loaded sled up a small slope before heading inside." } },
  { slot: "motor", title: "Wheelbarrow Bear Walk", icon: "🐻", benefit: "Core Strength", effort: 3, rating: 3, prep: "Zero Prep", envs: ["livingroom", "kaamos"], energies: ["overstimulated", "winddown", "fatigue"],
    steps: { toddler: "Show them a slow bear walk on hands and feet across the rug. Growl softly and stomp to the 'cave' (a blanket under the table).", preschool: "Hold their ankles for a slow wheelbarrow walk across the room. Switch to bear walks for the return trip, going as slowly as possible." } },

  { slot: "sensory", title: "Sensory Water Splash & Ice Rescue", icon: "🧊", benefit: "Tactile Regulation", effort: 3, rating: 3, prep: "5 Mins", envs: ["kaamos", "livingroom", "pakkanen"], energies: ["zoomies", "overstimulated"],
    steps: { toddler: "Freeze small toys in ice cubes and place them in a tray with warm water. Let them squeeze, splash and pour until the toys are rescued.", preschool: "Give them a pipette, warm salt water and frozen-toy blocks to rescue. Ask them to predict which tool will melt the ice fastest." } },
  { slot: "sensory", title: "Rainy Mud Kitchen", icon: "🥣", benefit: "Tactile Exploration", effort: 2, rating: 3, prep: "2 Mins", envs: ["kurakeli"], energies: ["zoomies", "fatigue", "winddown"],
    steps: { toddler: "Give them a pot, spoon and access to mud puddles to stir 'soup'. Name the textures together: squishy, cold, sticky.", preschool: "Set a menu challenge: mud pie, stick spaghetti and leaf salad. They gather, mix and 'serve' you each dish." } },
  { slot: "sensory", title: "Snow Paint Gallery", icon: "🎨", benefit: "Thermal & Tactile Input", effort: 2, rating: 2, prep: "5 Mins", envs: ["pakkanen"], energies: ["overstimulated", "winddown", "fatigue"],
    steps: { toddler: "Fill spray bottles with coloured water and spray patterns on clean snow. Touch the coloured snow together and talk about cold.", preschool: "Ask them to paint a family portrait or map in the snow. Take a photo of the 'gallery' before heading in." } },
  { slot: "sensory", title: "Rice Bin Treasure Dig", icon: "🪙", benefit: "Calming Tactile Input", effort: 2, rating: 1, prep: "2 Mins", envs: ["livingroom", "kaamos"], energies: ["overstimulated", "winddown", "fatigue"],
    steps: { toddler: "Hide a few large toys in a bin of dry rice or oats. Let them slowly dig, pour and find each one with their hands.", preschool: "Bury 8 small items and give them a picture checklist. They dig, tick off each find and rebury them for you." } },
  { slot: "sensory", title: "Flashlight Shadow Hunt", icon: "🔦", benefit: "Visual Tracking", effort: 1, rating: 2, prep: "Zero Prep", envs: ["kaamos", "livingroom"], energies: ["winddown", "zoomies"],
    steps: { toddler: "Dim the lights and slowly move a flashlight beam along the wall. They chase and 'catch' the light with their hands.", preschool: "Take turns making shadow animals on the wall. Guess each other's animals, then make up a short story starring them." } },

  { slot: "cooldown", title: "Deep Turtle Blanket Roll", icon: "🐢", benefit: "Deep Pressure Calm", effort: 1, rating: 5, prep: "Zero Prep", envs: ["kaamos", "livingroom", "pakkanen", "kurakeli"], energies: ["overstimulated", "winddown", "zoomies"],
    steps: { toddler: "Lay them on a blanket and roll them up snugly like a turtle in its shell. Give gentle presses along their back while you hum.", preschool: "They curl into a 'turtle' under a heavy blanket while you press gently on the shell. They peek out only when they feel calm and ready." } },
  { slot: "cooldown", title: "5-Finger Starfish Breathing", icon: "⭐", benefit: "Executive Function", effort: 1, rating: 5, prep: "Zero Prep", envs: ["kaamos", "livingroom", "pakkanen", "kurakeli"], energies: ["overstimulated", "winddown", "fatigue"],
    steps: { toddler: "Spread their hand like a starfish and trace each finger slowly with yours. Breathe in going up, out going down, together.", preschool: "They trace their own fingers: breathe in up each finger, breathe out down. Repeat on the other hand and notice how their body feels." } },
  { slot: "cooldown", title: "Metsä Forest Listening", icon: "🌲", benefit: "Mindful Awareness", effort: 1, rating: 4, prep: "Zero Prep", envs: ["kurakeli", "pakkanen"], energies: ["zoomies", "fatigue", "winddown"],
    steps: { toddler: "Stand still outside and cup your ears together. Point to each sound you hear: rain, birds, wind.", preschool: "Close your eyes for one minute and count every sound you hear. Compare lists and name the quietest one." } },
  { slot: "cooldown", title: "Sleepy Sauna Story", icon: "🧖", benefit: "Body Relaxation", effort: 1, rating: 5, prep: "Zero Prep", envs: ["kaamos", "livingroom"], energies: ["winddown", "fatigue"],
    steps: { toddler: "Wrap them in a warm towel on the sofa and tell a soft story about a cosy little sauna. Squeeze their arms and legs gently as each 'warms up'.", preschool: "Tell a story where they relax one body part at a time in a warm sauna. They melt each part like snow, from toes to nose." } },
];

const score = (a: Activity, energy: Energy, env: Env) =>
  (a.envs.includes(env) ? 2 : 0) + (a.energies.includes(energy) ? 1 : 0);

export function generateRoutine(energy: Energy, env: Env, seed = 0): Activity[] {
  return (["motor", "sensory", "cooldown"] as Slot[]).map((slot) => {
    const pool = A.filter((a) => a.slot === slot);
    const best = Math.max(...pool.map((a) => score(a, energy, env)));
    const top = pool.filter((a) => score(a, energy, env) === best);
    return top[seed % top.length];
  });
}

export const dots = (n: number, on: string, off: string) => on.repeat(n) + off.repeat(5 - n);

export function routineToMarkdown(acts: Activity[], age: Age, energy: Energy, env: Env): string {
  const lbl = <T extends { id: string; label: string }>(l: T[], id: string) => l.find((x) => x.id === id)!.label;
  const lines = [
    `# 🧸 Maverick's World – Adventure Routine`,
    "",
    `- **Age:** ${lbl(AGES, age)}`,
    `- **Energy:** ${lbl(ENERGIES, energy)}`,
    `- **Environment:** ${lbl(ENVS, env)}`,
    "",
  ];
  acts.forEach((a, i) => {
    lines.push(
      `## ${i + 1}. ${a.icon} ${a.title}`,
      `*${SLOT_LABEL[a.slot]}* · \`${a.benefit}\``,
      "",
      a.steps[age],
      "",
      `- Parent effort: ${a.effort}/5`,
      `- ${a.slot === "cooldown" ? "Calm" : "Energy burn"}: ${a.rating}/5`,
      `- Prep: ${a.prep}`,
      "",
    );
  });
  return lines.join("\n");
}
