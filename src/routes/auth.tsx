import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AccountForm } from "@/components/account-form";
import { useAccount } from "@/components/account-provider";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — Maverick's World" }, { name: "description", content: "Create your caregiver account to save child profiles and activity adventures privately." }, { property: "og:title", content: "Caregiver accounts — Maverick's World" }, { property: "og:description", content: "Sign in or create your Maverick's World account." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: AuthPage,
});
function AuthPage() {
  const { user } = useAccount();
  const navigate = useNavigate();
  useEffect(() => { if (user) void navigate({ to: "/", replace: true }); }, [user, navigate]);
  return <main className="mx-auto max-w-md space-y-8 px-5 py-10"><Link to="/" className="font-display text-2xl font-bold">Maverick's World 🧸</Link><AccountForm /></main>;
}