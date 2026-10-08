import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { AppShell, Panel, inputCls, btnCls } from "@/components/AppShell";
import { CopyButton } from "@/components/CopyButton";
import { generateEmail, type Tone } from "@/lib/ai";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — WorkMind" },
      { name: "description", content: "Generate professional emails in Formal, Friendly or Persuasive tones." },
      { property: "og:title", content: "Smart Email Generator — WorkMind" },
      { property: "og:description", content: "Generate professional emails in seconds." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EmailPage,
});

const tones: Tone[] = ["Formal", "Friendly", "Persuasive"];

function EmailPage() {
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [points, setPoints] = useState("");
  const [tone, setTone] = useState<Tone>("Formal");
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    setOut(await generateEmail({ recipient, subject, points, tone }));
    setLoading(false);
  };

  return (
    <AppShell title="Smart Email Generator" subtitle="Describe your email and choose a tone">
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Input">
          <div className="space-y-4">
            <label className="block text-sm font-medium">Recipient name
              <input className={`${inputCls} mt-1.5`} value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="e.g. Sarah" />
            </label>
            <label className="block text-sm font-medium">Subject
              <input className={`${inputCls} mt-1.5`} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Q4 project timeline" />
            </label>
            <label className="block text-sm font-medium">Key points (one per line)
              <textarea rows={5} className={`${inputCls} mt-1.5`} value={points} onChange={(e) => setPoints(e.target.value)} placeholder={"Deadline moved to 15 Nov\nNeed design sign-off by Friday"} />
            </label>
            <div>
              <span className="text-sm font-medium">Tone</span>
              <div className="mt-1.5 grid grid-cols-3 gap-2">
                {tones.map((t) => (
                  <button key={t} onClick={() => setTone(t)}
                    className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors ${tone === t ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <button className={`${btnCls} w-full`} onClick={run} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Generate email
            </button>
          </div>
        </Panel>
        <Panel title="Output — editable" action={<CopyButton text={out} />}>
          <textarea className={`${inputCls} min-h-[420px] flex-1 font-mono leading-relaxed`} value={out}
            onChange={(e) => setOut(e.target.value)} placeholder="Your generated email will appear here. You can edit it freely." />
        </Panel>
      </div>
    </AppShell>
  );
}
