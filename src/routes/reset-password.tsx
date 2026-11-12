import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { passwordSchema } from "@/lib/account-validation";

export const Route = createFileRoute("/reset-password")({ head: () => ({ meta: [{ title: "Reset password — Maverick's World" }, { name: "description", content: "Set a new password for your caregiver account." }, { property: "og:title", content: "Reset your Maverick's World password" }, { property: "og:description", content: "Securely restore access to your caregiver account." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }), component: ResetPassword });
function ResetPassword() {
  const [recovery, setRecovery] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (new URLSearchParams(window.location.hash.slice(1)).get("type") === "recovery") setRecovery(true);
    const { data } = supabase.auth.onAuthStateChange((event) => { if (event === "PASSWORD_RECOVERY") setRecovery(true); });
    return () => data.subscription.unsubscribe();
  }, []);
  return <main className="mx-auto max-w-md space-y-6 px-5 py-12"><h1 className="font-display text-3xl">Set a new password</h1>{!recovery ? <p>This reset link is missing or expired. Request a new one from sign in.</p> : done ? <p>Password updated.</p> : <form className="space-y-4" onSubmit={async (e) => {
    e.preventDefault(); setBusy(true);
    try { passwordSchema.parse(password); if (password !== confirm) throw new Error("Passwords do not match."); const { error } = await supabase.auth.updateUser({ password }); if (error) throw error; setDone(true); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Couldn't reset password."); }
    finally { setBusy(false); }
  }}><label className="block space-y-2">New password<Input type="password" autoComplete="new-password" required minLength={8} maxLength={128} value={password} onChange={(e) => setPassword(e.target.value)} /></label><label className="block space-y-2">Confirm password<Input type="password" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} /></label><Button disabled={busy} type="submit">Update password</Button></form>}{message && <p role="alert">{message}</p>}<Link to="/auth" className="text-primary">Back to sign in</Link></main>;
}