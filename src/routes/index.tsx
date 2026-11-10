import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Wand2, ClipboardCopy, X, Play, Pause, RotateCcw, Clock } from "lucide-react";
import {
  AGES, ENERGIES, ENVS, SLOT_LABEL, generateRoutine, routineToMarkdown, dots,
  type Age, type Energy, type Env, type Activity,
} from "@/lib/routines";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Maverick's World — Adventure Routines for Little Ones" },
      { name: "description", content: "Big energy, cozy naps, one adventure at a time. Instant play routines for toddlers and preschoolers, tuned for Finnish weather." },
      { property: "og:title", content: "Maverick's World 🧸" },
      { property: "og:description", content: "Instant sensory & movement routines for toddlers and preschoolers, plus an emergency Tantrum Tamer." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-full border-2 px-4 py-2.5 text-sm font-semibold transition-all text-left",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-soft scale-[1.02]"
          : "border-border bg-card text-foreground hover:border-primary/50",
      )}
    >
      {children}
    </button>
  );
}

function Section({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-3">
      <legend className="mb-3 flex items-center gap-2 font-display text-lg font-semibold">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-secondary text-sm text-secondary-foreground">{step}</span>
        {title}
      </legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

const CARD_TINT = ["bg-primary/10", "bg-accent", "bg-secondary"];

function ActivityCard({ a, age, i }: { a: Activity; age: Age; i: number }) {
  const calm = a.slot === "cooldown";
  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
      <div className={cn("flex items-center gap-3 p-5", CARD_TINT[i])}>
        <span className="text-4xl" aria-hidden>{a.icon}</span>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{i + 1} · {SLOT_LABEL[a.slot]}</p>
          <h3 className="font-display text-xl font-semibold leading-tight">{a.title}</h3>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <p className="leading-relaxed">{a.steps[age]}</p>
        <span className="self-start rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">{a.benefit}</span>
        <dl className="mt-auto grid gap-2 rounded-2xl bg-muted p-4 text-sm">
          <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Parent effort</dt><dd className="font-semibold">{dots(a.effort, "⭐", "☆")} {a.effort}/5</dd></div>
          <div className="flex justify-between gap-2"><dt className="text-muted-foreground">{calm ? "Calm" : "Energy burn"}</dt><dd className="font-semibold">{dots(a.rating, calm ? "🌙" : "🔥", "·")} {a.rating}/5</dd></div>
          <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Prep</dt><dd className="flex items-center gap-1 font-semibold"><Clock className="h-3.5 w-3.5" />{a.prep}</dd></div>
        </dl>
      </div>
    </article>
  );
}

const TAMER_STEPS = [
  { at: 0, text: "Get low and calm. Wrap them firmly in a blanket like a burrito, arms snug." },
  { at: 45, text: "Press slowly down the burrito from shoulders to feet, counting softly to 10." },
  { at: 90, text: "Hand them an ice cube (or cold cup). Squeeze it together — 'rescue the ice!'" },
  { at: 135, text: "Breathe together: smell the flower, blow out the candle. Repeat 5 times." },
];

function TantrumTamer({ onClose }: { onClose: () => void }) {
  const TOTAL = 180;
  const [left, setLeft] = useState(TOTAL);
  const [running, setRunning] = useState(true);
  useEffect(() => {
    if (!running || left <= 0) return;
    const t = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(t);
  }, [running, left]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  const elapsed = TOTAL - left;
  const current = [...TAMER_STEPS].reverse().find((s) => elapsed >= s.at)!;
  const mm = Math.floor(left / 60), ss = String(left % 60).padStart(2, "0");
  return (
    <div role="dialog" aria-modal="true" aria-label="Tantrum Tamer" className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-background">
      <div className="bg-gradient-emergency px-5 py-4 text-destructive-foreground">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <p className="font-display text-xl font-bold">🚨 Tantrum Tamer</p>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-2 hover:bg-background/20"><X /></button>
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center gap-6 p-6 text-center">
        <div>
          <h2 className="font-display text-3xl font-bold">Heavy Blanket Burrito Press</h2>
          <p className="text-muted-foreground">3 minutes · Zero prep · You've got this 💛</p>
        </div>
        <div className="relative grid h-56 w-56 place-items-center">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" strokeWidth="7" className="stroke-muted" />
            <circle cx="50" cy="50" r="45" fill="none" strokeWidth="7" strokeLinecap="round" className="stroke-destructive transition-all duration-1000"
              strokeDasharray={2 * Math.PI * 45} strokeDashoffset={2 * Math.PI * 45 * (elapsed / TOTAL)} />
          </svg>
          <span className="font-display text-5xl font-bold tabular-nums">{left > 0 ? `${mm}:${ss}` : "🎉"}</span>
        </div>
        <p className="min-h-16 rounded-3xl bg-card p-5 text-lg font-semibold shadow-soft">
          {left > 0 ? current.text : "Done! Offer a hug and a drink of water."}
        </p>
        <ol className="grid w-full gap-2 text-left text-sm">
          {TAMER_STEPS.map((s, i) => (
            <li key={i} className={cn("rounded-2xl border p-3", s === current && left > 0 ? "border-destructive bg-destructive/10 font-semibold" : "border-border text-muted-foreground")}>
              {i + 1}. {s.text}
            </li>
          ))}
        </ol>
        <div className="flex gap-3">
          <button onClick={() => setRunning((r) => !r)} className="flex items-center gap-2 rounded-full bg-destructive px-6 py-3 font-bold text-destructive-foreground">
            {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}{running ? "Pause" : "Resume"}
          </button>
          <button onClick={() => { setLeft(TOTAL); setRunning(true); }} className="flex items-center gap-2 rounded-full border-2 border-border px-6 py-3 font-bold">
            <RotateCcw className="h-4 w-4" />Restart
          </button>
        </div>
      </div>
    </div>
  );
}

function Index() {
  const [age, setAge] = useState<Age>("toddler");
  const [energy, setEnergy] = useState<Energy>("zoomies");
  const [env, setEnv] = useState<Env>("kaamos");
  const [routine, setRoutine] = useState<Activity[] | null>(null);
  const [seed, setSeed] = useState(0);
  const [tamer, setTamer] = useState(false);

  const generate = () => {
    setRoutine(generateRoutine(energy, env, seed));
    setSeed((s) => s + 1);
    setTimeout(() => document.getElementById("routine")?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const copy = async () => {
    if (!routine) return;
    try {
      await navigator.clipboard.writeText(routineToMarkdown(routine, age, energy, env));
      toast.success("Schedule copied!");
    } catch {
      toast.error("Couldn't copy — check browser permissions.");
    }
  };

  return (
    <div className="min-h-screen font-sans">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <h1 className="font-display text-xl font-bold sm:text-2xl">Maverick's World 🧸</h1>
            <p className="hidden text-sm text-muted-foreground sm:block">Big Energy, Cozy naps, one adventure at a time.</p>
          </div>
          <button onClick={() => setTamer(true)} className="shrink-0 rounded-full bg-gradient-emergency px-4 py-2.5 text-sm font-extrabold text-destructive-foreground shadow-soft transition-transform hover:scale-105 sm:px-5 sm:text-base">
            🚨 TANTRUM TAMER
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-20 pt-6">
        <p className="mb-6 text-center text-muted-foreground sm:hidden">Big Energy, Cozy naps, one adventure at a time.</p>
        <section className="space-y-8 rounded-[2rem] border border-border bg-card p-5 shadow-soft sm:p-8">
          <Section step={1} title="Child age group">
            {AGES.map((a) => <Chip key={a.id} active={age === a.id} onClick={() => setAge(a.id)}>{a.label}</Chip>)}
          </Section>
          <Section step={2} title="Energy right now">
            {ENERGIES.map((e) => <Chip key={e.id} active={energy === e.id} onClick={() => setEnergy(e.id)}>{e.label}</Chip>)}
          </Section>
          <Section step={3} title="Weather & space">
            {ENVS.map((e) => <Chip key={e.id} active={env === e.id} onClick={() => setEnv(e.id)}>{e.label}</Chip>)}
          </Section>
          <button onClick={generate} className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary px-6 py-5 font-display text-xl font-bold text-primary-foreground animate-glow transition-transform hover:scale-[1.01] active:scale-[0.99]">
            <Wand2 className="h-6 w-6" /> 🪄 Generate Adventure Routine
          </button>
        </section>

        {routine && (
          <section id="routine" className="mt-10 scroll-mt-24 space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-display text-2xl font-bold">Today's adventure ✨</h2>
              <button onClick={copy} className="flex items-center justify-center gap-2 rounded-full border-2 border-primary px-5 py-2.5 text-sm font-bold text-primary hover:bg-primary hover:text-primary-foreground">
                <ClipboardCopy className="h-4 w-4" /> 📋 Copy Schedule for Caregiver / Obsidian
              </button>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {routine.map((a, i) => <ActivityCard key={a.title} a={a} age={age} i={i} />)}
            </div>
          </section>
        )}
      </main>
      {tamer && <TantrumTamer onClose={() => setTamer(false)} />}
    </div>
  );
}
