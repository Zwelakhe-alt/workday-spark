import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import { AppShell, Panel, inputCls, btnCls } from "@/components/AppShell";
import { CopyButton } from "@/components/CopyButton";
import { researchTopic } from "@/lib/ai";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — WorkMind" },
      { name: "description", content: "Summarise topics and articles with key insights and recommendations." },
      { property: "og:title", content: "AI Research Assistant — WorkMind" },
      { property: "og:description", content: "Summaries, insights and recommendations in seconds." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const [input, setInput] = useState("");
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setOut(await researchTopic(input));
    setLoading(false);
  };

  return (
    <AppShell title="AI Research Assistant" subtitle="Enter a topic or paste an article">
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Input">
          <textarea rows={14} className={inputCls} value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. Hybrid work policies — or paste an article to summarise" />
          <button className={`${btnCls} mt-4`} onClick={run} disabled={loading || !input.trim()}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} Analyse
          </button>
        </Panel>
        <Panel title="Summary & insights — editable" action={<CopyButton text={out} />}>
          <textarea className={`${inputCls} min-h-[420px] flex-1 leading-relaxed`} value={out}
            onChange={(e) => setOut(e.target.value)} placeholder="Summary, key insights and recommendations will appear here." />
        </Panel>
      </div>
    </AppShell>
  );
}
