import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { childSchema, usernameSchema } from "@/lib/account-validation";
import { AGES } from "@/lib/routines";
import type { Tables } from "@/integrations/supabase/types";

export type ChildProfile = Tables<"children">;
export function FamilyProfiles({ userId, children, onChange }: { userId: string; children: ChildProfile[]; onChange: () => Promise<void> }) {
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [age, setAge] = useState<"toddler" | "preschool">("toddler");
  const [preferences, setPreferences] = useState("");
  const [editing, setEditing] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    void supabase.from("profiles").select("username").eq("id", userId).maybeSingle().then(({ data, error }) => {
      if (!active) return;
      if (error) setError("Couldn't load your profile. Please try again.");
      setUsername(data?.username ?? "");
    });
    return () => { active = false; };
  }, [userId]);
  return <section className="space-y-8">
    <h2 className="font-display text-3xl font-bold">Your family 🧸</h2>
    <form className="flex flex-wrap items-end gap-3 border-b border-border pb-6" onSubmit={async (e) => {
      e.preventDefault(); setBusy(true); setError("");
      try { const value = usernameSchema.parse(username); const { error } = await supabase.from("profiles").upsert({ id: userId, username: value }); if (error) throw error; setUsername(value); toast.success("Username saved."); }
      catch { setError("Couldn't save username. Use 3–30 letters, numbers, or underscores, or try another name."); }
      finally { setBusy(false); }
    }}><label className="space-y-2 font-semibold">Caregiver username<Input required minLength={3} maxLength={30} value={username} onChange={(e) => setUsername(e.target.value)} /></label><Button disabled={busy} type="submit">Save username</Button></form>
    {error && <p role="alert" className="text-destructive">{error}</p>}
    <div className="grid gap-4 sm:grid-cols-2">{children.map((child) => <article key={child.id} className="space-y-3 rounded-lg border border-border bg-card p-5"><h3 className="font-display text-xl">{child.nickname}</h3><p className="text-sm text-muted-foreground">{AGES.find((a) => a.id === child.age_group)?.label}</p>{child.preferences && <p className="whitespace-pre-wrap break-words">{child.preferences}</p>}<Button variant="outline" onClick={() => { setEditing(child.id); setNickname(child.nickname); setAge(child.age_group as "toddler" | "preschool"); setPreferences(child.preferences); }}>Edit {child.nickname}</Button></article>)}</div>
    <form className="max-w-lg space-y-4 border-t border-border pt-6" onSubmit={async (e) => {
      e.preventDefault(); setBusy(true); setError("");
      try {
        const values = childSchema.parse({ nickname, age_group: age, preferences });
        const result = editing ? await supabase.from("children").update(values).eq("id", editing).eq("user_id", userId) : await supabase.from("children").insert({ ...values, user_id: userId });
        if (result.error) throw result.error;
        await onChange(); setEditing(undefined); setNickname(""); setPreferences(""); toast.success("Child profile saved.");
      } catch { setError("Couldn't save this child profile. Check the details and try again."); }
      finally { setBusy(false); }
    }}><h3 className="font-display text-2xl">{editing ? "Edit child" : "Add a child"}</h3><label className="block space-y-2 font-semibold">Child nickname<Input required maxLength={60} value={nickname} onChange={(e) => setNickname(e.target.value)} /></label><fieldset><legend className="mb-2 font-semibold">Age group</legend><div className="flex flex-wrap gap-2">{AGES.map((a) => <Button key={a.id} type="button" aria-pressed={a.id === age} variant={a.id === age ? "default" : "outline"} onClick={() => setAge(a.id)}>{a.label}</Button>)}</div></fieldset><label className="block space-y-2 font-semibold">Activity preferences<Textarea maxLength={1000} placeholder="Favorite games, textures to avoid, or calming activities" value={preferences} onChange={(e) => setPreferences(e.target.value)} /></label><div className="flex gap-2"><Button disabled={busy} type="submit">{busy ? "Saving…" : "Save child"}</Button>{editing && <Button type="button" variant="ghost" onClick={() => { setEditing(undefined); setNickname(""); setPreferences(""); }}>Cancel</Button>}</div></form>
  </section>;
}