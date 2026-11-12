import { supabase } from "@/integrations/supabase/client";
import { validateVideo, type Completion } from "@/lib/activity-history";
import { z } from "zod";
import type { Json } from "@/integrations/supabase/types";

const completionSchema = z.object({
  id: z.string().uuid(), childId: z.string().uuid().optional(), age: z.enum(["toddler", "preschool"]),
  energy: z.enum(["zoomies", "overstimulated", "winddown", "fatigue"]), env: z.enum(["kaamos", "kurakeli", "pakkanen", "livingroom"]),
  completedAt: z.string().datetime(), stars: z.number().int().min(1).max(5), notes: z.string().max(5000),
});

export async function readCloudHistory(userId: string): Promise<Completion[]> {
  const { data, error } = await supabase.from("activity_completions").select("*").eq("user_id", userId).order("completed_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => ({ id: row.id, owner: userId, childId: row.child_id ?? undefined, activity: row.activity as unknown as Completion["activity"], age: row.age as Completion["age"], energy: row.energy as Completion["energy"], env: row.env as Completion["env"], completedAt: row.completed_at, stars: row.stars, notes: row.notes, videoPath: row.video_path ?? undefined }));
}

export async function saveCloudCompletion(entry: Completion): Promise<Completion> {
  completionSchema.parse(entry);
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user || entry.owner !== user.id) throw new Error("Please sign in again before saving.");
  let path = entry.videoPath;
  let uploaded: string | undefined;
  if (entry.video) {
    const message = validateVideo(entry.video);
    if (message) throw new Error(message);
    uploaded = `${user.id}/${entry.id}/${crypto.randomUUID()}`;
    const { error } = await supabase.storage.from("activity-clips").upload(uploaded, entry.video, { contentType: entry.video.type });
    if (error) throw error;
    path = uploaded;
  }
  const { error } = await supabase.from("activity_completions").upsert({ id: entry.id, user_id: user.id, child_id: entry.childId ?? null, activity: entry.activity as unknown as Json, age: entry.age, energy: entry.energy, env: entry.env, completed_at: entry.completedAt, stars: entry.stars, notes: entry.notes, video_path: path ?? null });
  if (error) {
    if (uploaded) await supabase.storage.from("activity-clips").remove([uploaded]);
    throw error;
  }
  if (uploaded && entry.videoPath) await supabase.storage.from("activity-clips").remove([entry.videoPath]);
  return { ...entry, video: undefined, videoPath: path };
}