import { useEffect, useId, useState } from "react";
import { Check, Film, Search, Star, Upload, UserRound, LogOut, History, Flame } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { energyPoints, filterHistory, validateVideo, type Completion } from "@/lib/activity-history";
import { AGES, ENERGIES, ENVS } from "@/lib/routines";
import { cn } from "@/lib/utils";

export function DemoAccount({ demo, onChange }: { demo: boolean; onChange: (demo: boolean) => void }) {
  const [open, setOpen] = useState(false);
  return <>
    {demo ? <div className="flex items-center gap-2"><UserRound className="h-5 w-5 text-primary" /><span className="text-sm font-bold">Welcome, Demo Caregiver 🧸</span><Button variant="ghost" size="icon" title="Log Out" aria-label="Log Out" onClick={() => onChange(false)}><LogOut /></Button></div>
      : <Button variant="outline" className="rounded-full" onClick={() => setOpen(true)}><UserRound />Login / Sign Up</Button>}
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="max-w-sm rounded-2xl"><DialogHeader><DialogTitle className="font-display text-2xl">Welcome, caregiver 🧸</DialogTitle><DialogDescription>Demo access · No password needed</DialogDescription></DialogHeader>
      <Button className="h-12 rounded-full" onClick={() => { onChange(true); setOpen(false); }}>Log in as Demo Caregiver</Button>
      <Button variant="outline" className="h-12 rounded-full" onClick={() => { onChange(false); setOpen(false); }}>Continue as Guest</Button>
    </DialogContent></Dialog>
  </>;
}

export function VideoPlayer({ video }: { video: Blob }) {
  const [url, setUrl] = useState<string>();
  useEffect(() => {
    const objectUrl = URL.createObjectURL(video);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [video]);
  return url ? <video aria-label="Activity video clip" src={url} controls preload="metadata" className="aspect-video w-full rounded-xl bg-muted object-contain" /> : null;
}

export function VideoUpload({ onSelect, disabled = false }: { onSelect: (file: File) => void; disabled?: boolean }) {
  const id = useId();
  const [error, setError] = useState<string | null>(null);
  return <div className="space-y-2">
    <div className="flex flex-wrap items-center gap-2">
      <Button type="button" variant="outline" disabled={disabled} onClick={() => document.getElementById(id)?.click()}><Upload />📹 Upload Video Clip</Button>
      <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">Max 30-second clip recommended</span>
    </div>
    <input id={id} type="file" accept="video/*" aria-label="Upload Video Clip" className="sr-only" disabled={disabled} onChange={(event) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) return;
      const message = validateVideo(file);
      setError(message);
      if (message) { toast.error(message); return; }
      onSelect(file);
    }} />
    {error && <p role="alert" className="text-sm font-semibold text-destructive">{error}</p>}
  </div>;
}

type CompletionDraft = Pick<Completion, "activity" | "age" | "energy" | "env">;

function localDateTime() {
  const date = new Date();
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

export function CompletionDialog({ draft, owner, onClose, onSave }: { draft: CompletionDraft; owner: Completion["owner"]; onClose: () => void; onSave: (entry: Completion) => Promise<void> }) {
  const [completedAt, setCompletedAt] = useState(localDateTime);
  const [stars, setStars] = useState(3);
  const [notes, setNotes] = useState("");
  const [video, setVideo] = useState<File>();
  const [busy, setBusy] = useState(false);
  return <Dialog open onOpenChange={(open) => { if (!open && !busy) onClose(); }}><DialogContent className="max-h-[90dvh] overflow-y-auto rounded-2xl">
    <DialogHeader><DialogTitle className="pr-5 font-display text-2xl">Complete activity</DialogTitle><DialogDescription>{draft.activity.icon} {draft.activity.title}</DialogDescription></DialogHeader>
    <form className="space-y-5" onSubmit={async (event) => {
      event.preventDefault();
      setBusy(true);
      try {
        await onSave({ ...draft, id: crypto.randomUUID(), owner, completedAt: new Date(completedAt).toISOString(), stars, notes: notes.trim(), ...(video ? { video } : {}) });
        onClose();
      } catch { toast.error("Couldn't save. Check available browser storage and try again."); }
      finally { setBusy(false); }
    }}>
      <label className="block space-y-2 text-sm font-bold">Completed date and time<Input type="datetime-local" required value={completedAt} onChange={(e) => setCompletedAt(e.target.value)} /></label>
      <fieldset className="space-y-2"><legend className="mb-2 text-sm font-bold">How well did it work?</legend><div className="flex gap-2">{[1, 2, 3, 4, 5].map((n) => <Button key={n} type="button" variant="ghost" size="icon" aria-label={`${n} ${n === 1 ? "star" : "stars"}`} aria-pressed={stars === n} onClick={() => setStars(n)} className="text-primary"><Star className={cn("h-6 w-6", n <= stars && "fill-primary")} /></Button>)}</div></fieldset>
      <label className="block space-y-2 text-sm font-bold">Caregiver notes (optional)<Textarea value={notes} maxLength={5000} onChange={(e) => setNotes(e.target.value)} /></label>
      <VideoUpload onSelect={setVideo} disabled={busy} />
      {video && <div className="space-y-2"><VideoPlayer video={video} /><Button type="button" variant="ghost" onClick={() => setVideo(undefined)}>Remove clip</Button></div>}
      <div className="flex justify-end gap-2"><Button type="button" variant="outline" disabled={busy} onClick={onClose}>Cancel</Button><Button type="submit" disabled={busy}><Check />{busy ? "Saving…" : "Save to Completed History"}</Button></div>
    </form>
  </DialogContent></Dialog>;
}

export function CompletedHistory({ entries, loading, error, onSave }: { entries: Completion[]; loading: boolean; error: string | null; onSave: (entry: Completion) => Promise<void> }) {
  const [search, setSearch] = useState("");
  const [stars, setStars] = useState("all");
  const [uploading, setUploading] = useState<string | null>(null);
  const visible = filterHistory(entries, search, stars);
  return <section className="space-y-6">
    <h2 className="font-display text-3xl font-bold">Completed History 📜</h2>
    <dl className="grid grid-cols-3 gap-3 border-y border-border py-5">
      <div><dt className="flex items-center gap-2 text-sm text-muted-foreground"><History />Completed</dt><dd className="mt-2 font-display text-3xl">{entries.length}</dd></div>
      <div><dt className="flex items-center gap-2 text-sm text-muted-foreground"><Flame />Energy burn points</dt><dd className="mt-2 font-display text-3xl">{energyPoints(entries)}</dd></div>
      <div><dt className="flex items-center gap-2 text-sm text-muted-foreground"><Star />Average rating</dt><dd className="mt-2 font-display text-3xl">{entries.length ? (entries.reduce((s, e) => s + e.stars, 0) / entries.length).toFixed(1) : "—"}</dd></div>
    </dl>
    <div className="flex flex-wrap items-center gap-3"><div className="relative min-w-0 flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input aria-label="Search completed activities" placeholder="Search activities or notes" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
      <select aria-label="Filter by rating" value={stars} onChange={(e) => setStars(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm"><option value="all">All ratings</option>{[5,4,3,2,1].map((n) => <option key={n} value={n}>{n} stars</option>)}</select>
    </div>
    {loading ? <p role="status">Loading history…</p> : error ? <p role="alert" className="text-destructive">{error}</p> : visible.length === 0 ? <div className="py-12 text-center"><Film className="mx-auto mb-4 h-10 w-10 text-primary" /><h3 className="font-display text-xl">{entries.length ? "No matching activities" : "No completed adventures yet"}</h3></div> : <div className="space-y-4">{visible.map((entry) => <article key={entry.id} className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3"><div className="flex gap-3"><span className="text-3xl" aria-hidden>{entry.activity.icon}</span><div><h3 className="font-display text-xl font-semibold">{entry.activity.title}</h3><time className="text-sm text-muted-foreground" dateTime={entry.completedAt}>{new Date(entry.completedAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</time></div></div><span className="shrink-0 font-bold text-primary">★ {entry.stars}/5</span></div>
      <p className="text-xs text-muted-foreground">{AGES.find((a) => a.id === entry.age)?.label} · {ENERGIES.find((e) => e.id === entry.energy)?.label} · {ENVS.find((e) => e.id === entry.env)?.label}</p>
      {entry.notes && <p className="whitespace-pre-wrap break-words">{entry.notes}</p>}
      {entry.video && <VideoPlayer video={entry.video} />}
      <VideoUpload disabled={uploading === entry.id} onSelect={async (video) => { setUploading(entry.id); try { await onSave({ ...entry, video }); toast.success("Video clip saved!"); } catch { toast.error("Couldn't save this clip. Check available browser storage."); } finally { setUploading(null); } }} />
    </article>)}</div>}
  </section>;
}