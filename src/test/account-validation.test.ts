import { describe, it, expect } from "vitest";
import { usernameSchema, signupSchema, childSchema } from "@/lib/account-validation";

describe("Real account and child details", () => {
  it("requires a real email rather than a username for signup", () => {
    expect(signupSchema.safeParse({ email: "caregiver", username: "caregiver", password: "long-password" }).success).toBe(false);
  });
  it("normalizes usernames and rejects unsafe characters", () => {
    expect(usernameSchema.parse(" Caregiver_1 ")).toBe("caregiver_1");
    expect(usernameSchema.safeParse("<script>").success).toBe(false);
  });
  it("requires passwords of at least eight characters", () => {
    expect(signupSchema.safeParse({ email: "parent@example.com", username: "parent", password: "1234567" }).success).toBe(false);
  });
  it("stores child nicknames, supported age groups, and preferences", () => {
    expect(childSchema.parse({ nickname: " Little Bear ", age_group: "toddler", preferences: " Loves cushions " })).toEqual({ nickname: "Little Bear", age_group: "toddler", preferences: "Loves cushions" });
    expect(childSchema.safeParse({ nickname: "Bear", age_group: "adult", preferences: "" }).success).toBe(false);
  });
});