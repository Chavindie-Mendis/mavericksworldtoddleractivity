import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Index } from "@/routes/index";
import { AGES, ENERGIES, ENVS, generateRoutine, routineToMarkdown } from "@/lib/routines";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("Generated routine selection snapshot", () => {
  it("keeps the generated age until Generate is clicked again", () => {
    const { container } = render(<Index />);
    const generate = screen.getByRole("button", { name: /Generate Adventure Routine/ });
    fireEvent.click(generate);
    const initial = generateRoutine("zoomies", "kaamos", 0);
    expect(container.querySelector("article p.leading-relaxed")?.textContent).toBe(initial[0]?.steps.toddler);

    fireEvent.click(screen.getByRole("button", { name: AGES[1]?.label ?? "Preschool" }));
    expect(container.querySelector("article p.leading-relaxed")?.textContent).toBe(initial[0]?.steps.toddler);

    fireEvent.click(generate);
    const next = generateRoutine("zoomies", "kaamos", 1);
    expect(container.querySelector("article p.leading-relaxed")?.textContent).toBe(next[0]?.steps.preschool);
  });

  it("exports the generated selections rather than pending age, energy, and weather", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    render(<Index />);
    const generate = screen.getByRole("button", { name: /Generate Adventure Routine/ });
    fireEvent.click(generate);
    fireEvent.click(screen.getByRole("button", { name: AGES[1]?.label ?? "Preschool" }));
    fireEvent.click(screen.getByRole("button", { name: ENERGIES[1]?.label ?? "Overstimulated" }));
    fireEvent.click(screen.getByRole("button", { name: ENVS[1]?.label ?? "Kurakeli" }));
    fireEvent.click(screen.getByRole("button", { name: /Copy Schedule/ }));
    expect(writeText).toHaveBeenLastCalledWith(routineToMarkdown(generateRoutine("zoomies", "kaamos", 0), "toddler", "zoomies", "kaamos"));

    fireEvent.click(generate);
    fireEvent.click(screen.getByRole("button", { name: /Copy Schedule/ }));
    expect(writeText).toHaveBeenLastCalledWith(routineToMarkdown(generateRoutine("overstimulated", "kurakeli", 1), "preschool", "overstimulated", "kurakeli"));
  });
});