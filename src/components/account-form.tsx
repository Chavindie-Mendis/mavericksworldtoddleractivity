import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import "@lovable.dev/cloud-auth-js/styles.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signupSchema } from "@/lib/account-validation";

export function AccountForm() {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const oauth = async (provider: "google" | "lovable") => {
    setBusy(true); setMessage("");
    try {
      const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: `${window.location.origin}/auth` });
      if (result.error) throw result.error;
      if (!result.redirected) await navigate({ to: "/", replace: true });
    } catch { setMessage("Couldn't sign in. Please try again."); }
    finally { setBusy(false); }
  };
  return <div className="space-y-6">
    <h1 className="font-display text-3xl font-bold">{mode === "signup" ? "Create your caregiver account" : mode === "forgot" ? "Reset your password" : "Welcome back, caregiver 🧸"}</h1>
    {mode !== "forgot" && <div className="flex gap-2"><Button variant={mode === "login" ? "default" : "ghost"} onClick={() => { setMode("login"); setMessage(""); }}>Sign in</Button><Button variant={mode === "signup" ? "default" : "ghost"} onClick={() => { setMode("signup"); setMessage(""); }}>Sign up</Button></div>}
    <form className="space-y-4" onSubmit={async (e) => {
      e.preventDefault(); setBusy(true); setMessage("");
      try {
        if (mode === "signup") {
          const values = signupSchema.parse({ email, username, password });
          const { error } = await supabase.auth.signUp({ email: values.email, password: values.password, options: { emailRedirectTo: `${window.location.origin}/auth`, data: { requested_username: values.username } } });
          if (error) throw error;
          setMessage("Check your email to confirm your account, then sign in. Your username will be saved after confirmation.");
        } else if (mode === "forgot") {
          const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/reset-password` });
          if (error) throw error;
          setMessage("If an account exists for this email, a password reset link is on its way.");
        } else {
          const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
          if (error) throw error;
          await navigate({ to: "/", replace: true });
        }
      } catch (error) { setMessage(error instanceof Error ? error.message : "Couldn't complete this request. Please try again."); }
      finally { setBusy(false); }
    }}>
      {mode === "signup" && <label className="block space-y-2 font-semibold">Username<Input required autoComplete="username" minLength={3} maxLength={30} pattern="[a-zA-Z0-9_]{3,30}" value={username} onChange={(e) => setUsername(e.target.value)} /></label>}
      <label className="block space-y-2 font-semibold">Email<Input type="email" required maxLength={255} autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
      {mode !== "forgot" && <label className="block space-y-2 font-semibold">Password<Input type="password" required minLength={mode === "signup" ? 8 : undefined} maxLength={128} autoComplete={mode === "signup" ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} /></label>}
      <Button disabled={busy} className="w-full" type="submit">{busy ? "Please wait…" : mode === "signup" ? "Create account" : mode === "forgot" ? "Send reset link" : "Sign in with email"}</Button>
    </form>
    {message && <p role="status" className="break-words text-sm">{message}</p>}
    <Button variant="link" onClick={() => { setMode(mode === "forgot" ? "login" : "forgot"); setMessage(""); }}>{mode === "forgot" ? "Back to sign in" : "Forgot password?"}</Button>
    {mode !== "forgot" && <div className="space-y-3 border-t border-border pt-5">
      <Button disabled={busy} onClick={() => oauth("google")} variant="outline" className="google-auth-button h-11 w-full"><svg aria-hidden="true" viewBox="0 0 24 24" className="h-[18px] w-[18px]"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>Continue with Google</Button>
      <Button disabled={busy} onClick={() => oauth("lovable")} className="lovable-auth-button h-11 w-full">Continue with Lovable</Button>
    </div>}
    <Link to="/" className="block text-center text-sm text-primary">Continue as guest</Link>
  </div>;
}