import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { LayoutGrid, Mail, BookOpen, MessageSquare, Menu, X, ShieldCheck } from "lucide-react";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutGrid },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/research", label: "Research Assistant", icon: BookOpen },
  { to: "/chat", label: "AI Chatbot", icon: MessageSquare },
] as const;

export function AppShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform md:static md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <span className="text-lg font-semibold tracking-tight">WorkMind<span className="text-sidebar-primary">.</span></span>
          <button className="md:hidden" onClick={() => setOpen(false)} aria-label="Close menu"><X className="h-5 w-5" /></button>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {nav.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              activeOptions={{ exact: true }}
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
              activeProps={{ className: "bg-sidebar-accent !text-sidebar-foreground" }}
            >
              <Icon className="h-4 w-4" /> {label}
            </Link>
          ))}
        </nav>
        <div className="m-3 rounded-md border border-sidebar-border p-3 text-xs text-sidebar-foreground/60">
          <ShieldCheck className="mb-1 h-4 w-4" />
          No sign-up. Nothing you type is stored or sent anywhere.
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-30 bg-foreground/40 md:hidden" onClick={() => setOpen(false)} />}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b bg-card px-5 py-4 md:px-8">
          <button className="md:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu className="h-5 w-5" /></button>
          <div>
            <h1 className="text-lg font-semibold tracking-tight md:text-xl">{title}</h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </header>
        <main className="flex-1 p-5 md:p-8">{children}</main>
        <footer className="border-t bg-card px-5 py-4 text-xs text-muted-foreground md:px-8">
          <strong className="text-foreground">Responsible AI:</strong> Responses are AI generated and may be inaccurate.
          Review all output before use and avoid sharing sensitive personal or company data.
        </footer>
      </div>
    </div>
  );
}

export function Panel({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="flex flex-col rounded-lg border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export const inputCls =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
export const btnCls =
  "inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50";
export const ghostBtnCls =
  "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium hover:bg-muted";
