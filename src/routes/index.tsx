import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, BookOpen, MessageSquare, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WorkMind — AI Workplace Productivity Assistant" },
      { name: "description", content: "Write emails, research topics and chat with a workplace AI assistant. No sign-up needed." },
      { property: "og:title", content: "WorkMind — AI Workplace Productivity Assistant" },
      { property: "og:description", content: "Write emails, research topics and chat with a workplace AI assistant." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const tools = [
  { to: "/email", icon: Mail, title: "Smart Email Generator", desc: "Draft professional emails in Formal, Friendly or Persuasive tones." },
  { to: "/research", icon: BookOpen, title: "AI Research Assistant", desc: "Summarise topics or articles with insights and recommendations." },
  { to: "/chat", icon: MessageSquare, title: "AI Chatbot", desc: "Ask workplace questions and get practical answers instantly." },
] as const;

function Index() {
  return (
    <AppShell title="Dashboard" subtitle="Your AI toolkit for everyday work">
      <div className="mb-8 rounded-lg bg-primary p-8 text-primary-foreground">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Work smarter, not longer.</h2>
        <p className="mt-2 max-w-xl text-sm opacity-70">Pick a tool below to get started — no account required.</p>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {tools.map(({ to, icon: Icon, title, desc }) => (
          <Link key={to} to={to} className="group rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 inline-flex rounded-md bg-muted p-2.5"><Icon className="h-5 w-5" /></div>
            <h3 className="font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium">
              Open <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
