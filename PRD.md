# **Product Requirements Document (PRD): Maverick's World**

> _Big Energy, Cozy naps, one Adventure at a time._

**Project Name:** Maverick's World  
**Target Audience:** Parents & Caregivers of High-Energy & Neurodivergent Children (Ages 1–6 / Early Childhood Education & Care Phase in Finland)  
**Pedagogical Framework:** Finnish ECEC ( _Early Childhood Education_ ) & Sensory Integration for Neurodiversity  
**Version:** 5.0 (MVP)  
**Author:** Creative Lead / Product Manager

---

## **1. Executive Summary & Problem Statement**

In Finland, early childhood education and care (ECEC / _Varhaiskasvatus_ ) covers children aged 1 to 6 (Daycare through Preschool / _Esiopetus_ ), prior to compulsory primary school ( _peruskoulu_ ), which begins at age 7. Parents and caregivers of high-energy, hyperactive, and neurodivergent children (ADHD, Sensory Processing Sensitivity, Autistic spectrum) face steep daily challenges managing energy spikes, overstimulation, and emotional meltdowns. These challenges are intensified by Finland's extreme seasonal shifts—long, dark winter months ( _kaamos_ ), cold rain and slush seasons ( _kurakeli_ ), sub-zero days ( _pakkanen_ ), and overstimulating indoor transitions.

**Maverick's World** ( _"Big Energy, Cozy naps, one Adventure at a time."_ ) is a specialized, Finnish pedagogical-grounded web application designed to help caregivers instantly generate micro-structured activity routines, heavy-work sensory inputs, and calm-down transitions at home. Grounded in the Finnish National Core Curriculum for ECEC ( _Varhaiskasvatusupluannuan rasuteet_ ), the national physical activity recommendation of minimum 3 hours of daily movement ( _the joy of movement_ ), and sensory regulation principles, the app transforms home chaotic energy into structured, joyful, and developmental play.

---

## **2. Target Audience & Educational Context (Ages 1–6)**

### **2.1 Early Childhood Framework (Finland Context)**

According to Finnish early childhood regulations:

- **Early Childhood Phase (Ages 1–6):** Focuses strictly on play-based learning ( _play pedagogy_ ), sensory exploration, self-regulation development, and Joy of movement. Formal academic schooling starts at age 7.

### **2.2 Age Bracket Segmentation**

- **_Early Toddlerhood ( Ages_ 1–3 ):**
    - _Developmental Focus:_ High sensory exploration, Gross motor movement, emotional co-regulation, simple cause-and-effect, simple nap/quiet transitions.
    - _Caregiver Needs:_ Extremely low prep (under 2 mins), heavy adult scaffolding, tactile/proprioceptive grounding (eg, pillow piles, water play, heavy blanket presses).
- **Preschool & Kindergarten (Ages 4–6 / _Toddlers & Preschoolers_ ):**
    - _Developmental Focus:_ Executive function support, multi-step imaginative quests, heavy work ( _deep sensory and muscle sensory inputs_ ), self-guided obstacle courses, structured quiet time / un-plugged decompression (replacing daytime naps).
    - _Caregiver Needs:_ Visual choice boards, gamified challenges, autonomy within boundaries, clear visual timers.

### **2.3 Neurodivergent & Hyperactivity Focus (ADHD / SPD / Autism)**

- **Proprioceptive & Vestibular Input ("Heavy Work"):** Activities designed to give joint compression, pushing/pulling, and rocking to regulate hyperactive nervous systems.
- **Low-Friction Visual Structure:** Reduces executive functioning load for both parent and child.
- **Overstimulation Controls:** Quick sensory resets when indoor environments create sensory overload.

---

## **3. Finnish Pedagogical & Seasonal Weather Integration**

### **3.1 Finnish ECEC Pedagogical Pillars ( _Early Childhood Education_ )**

1. **Joy of Physical Movement ( _Liikkuminen ilo_ ):** Aligning with Finnish national recommendations for physical activity in early childhood (minimum 3 hours of daily varied physical activity).
2. **Play-Based Learning _:_ Unstructured** creative quests masked as active games.
3. **Self-Regulation & Mindfulness _:_ Guided** sensory cool-downs to help neurodivergent children transition between high-energy and rest states.

### **3.2 Seasonal & Weather Adaptation Engine**

The app incorporates a dedicated **Finnish Weather & Environment Engine** :

- **Dark Winter Months ( _Kaamos & Pakkanen_ ):** Indoor heavy-work obstacle courses, glow-stick sensory play, warm-up movement routines when sub-zero temps curtail outdoor duration.
- **Slush & Mud Season ( _Kurakeli / Autumn and spring rains_ ):** Porch/hallway gear-change games, wet-weather outdoor scavenger hunts (geared for _Kurakeli_ / rubber boots), indoor rain-sound calming routines.
- **Bright Midnight Sun Summers ( _Kesä & Yötö yö_ ):** Evening wind-down routines tailored for high ambient light, outdoor nature sensory trails.

---

## **4. Feature Scope & Requirements**

### **Must-Have Features (MVP — Version 1.0)**

1. **Child Profile & Age Bracket Selector:**

- Toggle between **Toddler (Ages 1–3)** and **Preschooler (Ages 4–6)** .

2. **Finnish Weather & Environment Context Toggle:**

- Weather condition selector: _Indoor Winter/Kaamos_ , _Wet Outdoor/Kurakeli_ , _Sub-Zero Quick Burn_ , _Living Room Space_ .

3. **Energy & Neuro-Regulation Filter:**

- Sensory/Energy state: _High Zoomies / Hyperactive_ , _Sensory Overload / Meltdown Risk_ , _Post-Preschool Fatigue_ , _Pre-Bed Wind Down_ .

4. **Pedagogical Activity Generator & Schedule Engine:**

- Outputs 2 Active Heavy-Work Cards + 1 Finnish ECEC Cool-Down Card.
- Ratings displayed per card: **Parent Effort Score** (1–5), **Proprioceptive/Energy Burn Score** (1–5), and **Prep Time** (minutes).

5. **Emergency "Tantrum Tamer" / Sensory Reset Button:**

- 1-click persistent header button for acute sensory meltdowns.
- Instantly displays a 3-minute zero-prep sensory grounding activity (eg, _"Ice Cube Squeeze"_ , _"Heavy Blanket Burrito"_ , _"Deep Turtle Press"_ ).

6. **Visual Schedule & One-Touch Copy for Obsidian / Caregiver:**

- Text/Markdown export designed to copy cleanly into family logs, Obsidian, or caregiver notes.

### **Future Features (Out of Scope — Version 2.0)**

- **Finnish Nature Trail Audio Quests:** Story-based audio tracks for forest _walks_ .
- **Multi-Child Co-Op Mode:** Activity adaptations for siblings across different age brackets (eg, 2yo + 5yo team-ups).

---

## **5. User Flow Architecture**

### **5.1 Tabular User Flow Summary**

|Step #|User Action|System Processing|UI Output / State Change|
|---|---|---|---|
|**1**|Selects Child Age Group (Ages 1–3 or 4–6) & Current Mood/Energy level|Stores demographic & energy state in session state|Highlights selected filter chips|
|**2**|Toggles Environment / Weather context (eg, _Indoor Winter / Kaamos_ )|Queries Finnish ECEC activity database filtered by weather + age|Updates environment context badge|
|**3**|Clicks **"Generate Adventure"**|Runs matching algorithm: 2 Heavy-Work cards + 1 Cool-Down card|Renders visual step-by-step Activity Cards with Effort/Burn scores|
|**4**|_(Optional)_ Taps persistent **"Tantrum Tamer"** button|Overrides current screen; fetches zero-prep sensory reset protocol|Displays full-screen 3-minute Emergency Sensory Grounding Card|
|**5**|Clicks **"Copy for Caregiver / Obsidian"**|Formats schedule into clean Markdown string|Copies text to device clipboard with success toast notification|

### **5.2 Visual Flow Diagram (Copyable for Obsidian / Markdown)**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           START USER JOURNEY                            │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      STEP 1: CONFIGURATION INPUTS                       │
│  ├── Select Child Age:   [ Ages 1–3 (Toddler) | Ages 4–6 (Preschool) ]   │
│  ├── Select Energy State:[ Zoomies | Overstimulated | Wind-Down ]        │
│  └── Select Environment: [ Indoor Winter | Kurakeli Outdoor | Backyard ] │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    STEP 2: TRIGGER GENERATION                           │
│                      [ Click "Generate Adventure" ]                     │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     STEP 3: GENERATED ACTIVITY DASHBOARD                │
│  ├── Card 1: Gross Motor / Proprioceptive Heavy Work (e.g., Pillow Wall)│
│  ├── Card 2: Sensory / Pedagogical Quest (e.g., Ice Rescue / Scavenger) │
│  └── Card 3: Finnish ECEC Cool-Down (e.g., Turtle Breathing / Story)    │
│  └── Display Metrics: Parent Effort (1-5) | Energy Burn Score (1-5)     │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
            ┌────────────────────────┴────────────────────────┐
            │                                                 │
            ▼ (Normal Completion)                             ▼ (Emergency Meltdown)
┌───────────────────────────────┐               ┌───────────────────────────────┐
│     STEP 4A: EXPORT &amp; USE     │               │  STEP 4B: "TANTRUM TAMER"     │
│ [ Click "Copy for Obsidian" ] │               │   [ Tap 1-Click Header Button]│
│  ├── Copies Markdown Text     │               │  ├── Overrides Active View    │
│  └── Shares with Caregivers   │               │  └── Instant 3-Min Grounding  │
└───────────────────────────────┘               └───────────────────────────────┘

```

---

## **6. Sample Activity Matrix (Grounded in Finnish ECEC & Weather)**

|Age Bracket|Weather / Context|Activity Title|Pedagogical / Sensory Benefit|Parent Effort (1-5)|Energy Burn (1-5)|
|---|---|---|---|---|---|
|**Ages 1–3**|Indoor Winter ( _Kaamos_ )|**Pillow Mountain Avalanche**|Proprioceptive heavy work & spatial awareness|2|5|
|**Ages 1–3**|Rain/Mud ( _Kurakeli_ )|**Sensory Water Bucket Splash**|Tactile sensory integration & fine motor control|1|3|
|**Ages 4–6**|Sub-Zero ( _Frost_ )|**Indoor Ninja Obstacle Quest**|Vestibular balance, motor planning & executive function|2|5|
|**Ages 4–6**|Rainy Outdoor ( _Kurakeli_ )|**Puddle Jump Target Challenge**|Gross motor coordination & outdoor resilience|2|4|
|**Ages 1–6**|Emergency Meltdown|**Deep Turtle Blanket Roll**|Deep pressure therapy (DPPT) for nervous system reset|1|N/A (Calming)|

---

## **7. Success Criteria & Acceptance Testing Protocol**

- **Acceptance Test 1 (Age & Weather Filtering):** Selecting _Ages 4–6_ and _Indoor Winter_ generates activities tailored to preschool Cognitive levels and indoor spatial boundaries.
- **Acceptance Test 2 (Sensory Crisis Latency):** Tapping _Tantrum Tamer_ renders an emergency grounding activity in under **1 second** without screen clutter.
- **Acceptance Test 3 (Obsidian Export Compatibility):** Exported text formats perfectly into Markdown headers, tables, and bulleted checklists compatible with Obsidian, Notion, and plain text files.
- **Acceptance Test 4 (Finnish ECEC Alignment):** 100% of generated activity schedules conclude with a dedicated calm-down/sensory regulation transition step.