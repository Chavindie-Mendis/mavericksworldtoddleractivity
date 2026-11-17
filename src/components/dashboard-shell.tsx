import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, PanelLeftClose, PanelLeftOpen, WandSparkles, History, Users, Heart, LogOut, ArrowUpRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import bear from "@/assets/play-bear.png";

type View = "generator" | "history" | "family";
export function DashboardShell({ view, onView, signedIn, onSignOut, onTamer, children }: { view: View; onView: (view: View) => void; signedIn: boolean; onSignOut: () => void; onTamer: () => void; children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const changeView = (next: View) => { onView(next); setMobileOpen(false); };
  const navigation = (compact = false) => <nav aria-label="Caregiver dashboard" className="space-y-2">
    {[{ id: "generator" as const, label: "Generator", icon: WandSparkles }, { id: "history" as const, label: "Completed History", icon: History }, ...(signedIn ? [{ id: "family" as const, label: "Your family", icon: Users }] : [])].map((item) => <Button key={item.id} variant="ghost" aria-pressed={view === item.id} aria-label={item.label} title={item.label} onClick={() => changeView(item.id)} className={cn("h-12 w-full justify-start rounded-lg", compact && "justify-center px-0", view === item.id && "bg-accent text-accent-foreground hover:bg-accent")}><item.icon />{!compact && item.label}</Button>)}
    <Button variant="ghost" title="Tantrum Tamer" aria-label="Tantrum Tamer" onClick={() => { setMobileOpen(false); onTamer(); }} className={cn("h-12 w-full justify-start text-destructive", compact && "justify-center px-0")}><Heart />{!compact && "Tantrum Tamer"}</Button>
  </nav>;
  return <div className="min-h-screen bg-background font-sans">
    <aside className={cn("fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-border bg-card px-4 py-7 lg:flex", collapsed ? "w-20" : "w-64")}>
      <div className={cn("mb-12 flex items-center gap-3", collapsed && "justify-center")}><span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary text-secondary-foreground"><Sparkles className="h-5 w-5" /></span>{!collapsed && <span className="font-display text-sm font-semibold leading-6">Maverick’s<br />World</span>}</div>
      {!collapsed && <p className="mb-3 px-3 text-xs font-semibold uppercase text-muted-foreground">Your playground</p>}
      {navigation(collapsed)}
      <div className="mt-auto border-t border-border pt-5">{signedIn ? <Button variant="ghost" title="Sign out" aria-label="Sign out" onClick={onSignOut} className={cn("w-full justify-start", collapsed && "justify-center px-0")}><LogOut />{!collapsed && "Sign out"}</Button> : <Button asChild variant="outline" className="w-full px-2"><Link to="/auth" title="Login / Sign Up">{collapsed ? <ArrowUpRight /> : "Login / Sign Up"}</Link></Button>}</div>
    </aside>
    <div className={cn("min-w-0", collapsed ? "lg:ml-20" : "lg:ml-64")}>
      <header className="sticky top-0 z-20 flex h-20 items-center justify-between gap-3 border-b border-border bg-card/95 px-4 backdrop-blur sm:px-8">
        <div className="flex min-w-0 items-center gap-3"><Button variant="ghost" size="icon" className="hidden lg:inline-flex" aria-label={collapsed ? "Expand menu" : "Collapse menu"} title={collapsed ? "Expand menu" : "Collapse menu"} onClick={() => setCollapsed(!collapsed)}>{collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}</Button><Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu" onClick={() => setMobileOpen(true)}><Menu /></Button><span className="truncate text-sm font-semibold">{view === "generator" ? "Adventure studio" : view === "history" ? "Completed History" : "Your family"}</span></div>
        <Button variant="outline" className="h-10 shrink-0 border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={onTamer}><Heart />Tantrum Tamer</Button>
      </header>
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-7 sm:px-8 sm:pt-10">
        {view === "generator" && <div className="mb-8 flex items-center justify-between gap-4 border-b border-border pb-7"><div className="min-w-0"><p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase text-primary"><Sparkles className="h-4 w-4" />A little play. A big adventure.</p><h1 className="font-display text-2xl font-semibold sm:text-3xl">Maverick's World</h1><p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">Activity routines for toddlers and preschoolers.<br className="hidden sm:block" /> Big energy, cozy naps, one adventure at a time.</p></div><img src={bear} alt="Friendly teddy bear holding a blue star" width={512} height={512} className="h-28 w-24 shrink-0 object-contain sm:h-40 sm:w-40" /></div>}
        {children}
      </main>
    </div>
    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}><SheetContent side="left" className="w-72 bg-card"><SheetTitle className="mb-2 font-display">Maverick’s World</SheetTitle><SheetDescription className="sr-only">Caregiver navigation</SheetDescription><div className="mt-8">{navigation()}{signedIn ? <Button variant="ghost" onClick={onSignOut} className="mt-8 w-full justify-start"><LogOut />Sign out</Button> : <Button asChild variant="outline" className="mt-8 w-full"><Link to="/auth">Login / Sign Up</Link></Button>}</div></SheetContent></Sheet>
  </div>;
}