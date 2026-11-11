import type { Activity, Age, Energy, Env } from "@/lib/routines";

export const MAX_VIDEO_BYTES = 15 * 1024 * 1024;
export const VIDEO_SIZE_ERROR = "⚠️ File exceeds the 15 MB limit. Please upload a shorter clip or compress the video.";

export function validateVideo(file: Pick<File, "size" | "type">): string | null {
  if (file.size > MAX_VIDEO_BYTES) return VIDEO_SIZE_ERROR;
  if (!file.type.startsWith("video/")) return "Please select a video file.";
  return null;
}

export interface Completion {
  id: string;
  owner: "guest" | "demo";
  activity: Activity;
  age: Age;
  energy: Energy;
  env: Env;
  completedAt: string;
  stars: number;
  notes: string;
  video?: Blob;
}

export function energyPoints(entries: Completion[]): number {
  return entries.reduce((sum, entry) => sum + (entry.activity.slot === "cooldown" ? 0 : entry.activity.rating), 0);
}

export function filterHistory(entries: Completion[], search: string, stars: string): Completion[] {
  const query = search.trim().toLowerCase();
  return entries.filter((e) => `${e.activity.title} ${e.notes}`.toLowerCase().includes(query) && (stars === "all" || e.stars === Number(stars)))
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt));
}

function openHistory(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("mavericks-world-history", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("completions", { keyPath: "id" });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function readHistory(owner: Completion["owner"]): Promise<Completion[]> {
  const db = await openHistory();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("completions", "readonly");
    const request = tx.objectStore("completions").getAll();
    request.onsuccess = () => resolve((request.result as Completion[]).filter((e) => e.owner === owner));
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}

export async function saveCompletion(entry: Completion): Promise<void> {
  if (entry.video) {
    const error = validateVideo(entry.video);
    if (error) throw new Error(error);
  }
  if (!Number.isInteger(entry.stars) || entry.stars < 1 || entry.stars > 5) throw new Error("Choose a rating from 1 to 5.");
  const db = await openHistory();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("completions", "readwrite");
    tx.objectStore("completions").put(entry);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
    tx.onabort = () => { db.close(); reject(tx.error); };
  });
}