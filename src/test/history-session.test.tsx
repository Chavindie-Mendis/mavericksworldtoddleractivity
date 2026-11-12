import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Index } from "@/routes/index";
import { generateRoutine } from "@/lib/routines";
import type { Completion } from "@/lib/activity-history";

const storage = vi.hoisted(() => ({ read: vi.fn(), save: vi.fn() }));
vi.mock("@/lib/activity-history", async (original) => ({
  ...await original<typeof import("@/lib/activity-history")>(),
  readHistory: storage.read,
  saveCompletion: storage.save,
}));

function entry(owner: Completion["owner"]): Completion {
  const activity = generateRoutine("zoomies", "kaamos", 0)[0];
  if (!activity) throw new Error("Missing activity");
  return { id: "saved", owner, activity, age: "toddler", energy: "zoomies", env: "kaamos", completedAt: "2026-11-12T05:00:00Z", stars: 5, notes: "Saved guest note" };
}

afterEach(() => { cleanup(); localStorage.clear(); vi.clearAllMocks(); });

describe("History session transitions", () => {
  it("retains guest history when continuing as the current guest", async () => {
    storage.read.mockResolvedValue([entry("guest")]);
    render(<Index />);
    fireEvent.click(screen.getByRole("button", { name: /📜 Completed History/ }));
    await screen.findByText("Saved guest note");
    fireEvent.click(screen.getByRole("button", { name: "Login / Sign Up" }));
    fireEvent.click(screen.getByRole("button", { name: "Continue as Guest" }));
    expect(screen.getByText("Saved guest note")).toBeInTheDocument();
  });

  it("does not show a pending guest save in demo history after switching accounts", async () => {
    storage.read.mockImplementation((owner: Completion["owner"]) => Promise.resolve(owner === "guest" ? [{ ...entry("guest"), notes: "Pending guest note" }] : []));
    let finish: (() => void) | undefined;
    storage.save.mockImplementation(() => new Promise<void>((resolve) => { finish = resolve; }));
    render(<Index />);
    await waitFor(() => expect(storage.read).toHaveBeenCalledWith("guest"));
    fireEvent.click(screen.getByRole("button", { name: /📜 Completed History/ }));
    await screen.findByText("Pending guest note");
    fireEvent.change(screen.getByLabelText("Upload Video Clip"), { target: { files: [new File(["clip"], "clip.webm", { type: "video/webm" })] } });
    fireEvent.click(screen.getByRole("button", { name: "Login / Sign Up" }));
    fireEvent.click(screen.getByRole("button", { name: "Log in as Demo Caregiver" }));
    await waitFor(() => expect(storage.read).toHaveBeenCalledWith("demo"));
    await act(async () => { finish?.(); });
    fireEvent.click(screen.getByRole("button", { name: /📜 Completed History/ }));
    expect(screen.queryByText("Pending guest note")).not.toBeInTheDocument();
  });
});