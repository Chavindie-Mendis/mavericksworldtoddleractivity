import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

const AccountContext = createContext<{ user: User | null; ready: boolean; recovery: boolean }>({ user: null, ready: true, recovery: false });
export const useAccount = () => useContext(AccountContext);

export function AccountProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [recovery, setRecovery] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  useEffect(() => {
    let active = true;
    let revision = 0;
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (!["SIGNED_IN", "SIGNED_OUT", "USER_UPDATED", "PASSWORD_RECOVERY"].includes(event)) return;
      revision++;
      if (!active) return;
      setUser(session?.user ?? null);
      if (event === "PASSWORD_RECOVERY") setRecovery(true);
      if (event === "SIGNED_OUT") setRecovery(false);
      setReady(true);
      void router.invalidate();
      if (event === "SIGNED_OUT") { void queryClient.cancelQueries(); queryClient.clear(); }
      else void queryClient.invalidateQueries();
    });
    const initialRevision = revision;
    void supabase.auth.getUser().then(({ data }) => {
      if (active && revision === initialRevision) { setUser(data.user); setReady(true); }
    }).catch(() => { if (active) setReady(true); });
    return () => { active = false; data.subscription.unsubscribe(); };
  }, [queryClient, router]);
  return <AccountContext.Provider value={{ user, ready, recovery }}>{children}</AccountContext.Provider>;
}