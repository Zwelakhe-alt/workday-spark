import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send, Loader2, Bot, Pencil, Check } from "lucide-react";
import { AppShell, inputCls, btnCls } from "@/components/AppShell";
import { chatReply } from "@/lib/ai";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — WorkMind" },
      { name: "description", content: "Chat with a workplace AI assistant for practical productivity help." },
      { property: "og:title", content: "AI Chatbot — WorkMind" },
      { property: "og:description", content: "Your interactive workplace AI assistant." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "ai"; text: string };
const suggestions = ["Help me prioritise my tasks", "Create a meeting agenda", "How can I stay focused?", "How do I give feedback?"];

function ChatPage() {
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "ai", text: "Hi! I'm your workplace assistant. How can I help today?" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => end.current?.scrollIntoView({ behavior: "smooth" }), [msgs, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    setLoading(true);
    const reply = await chatReply(text);
    setMsgs((m) => [...m, { role: "ai", text: reply }]);
    setLoading(false);
  };

  return (
    <AppShell title="AI Chatbot" subtitle="Ask anything about your workday">
      <div className="mx-auto flex h-[calc(100vh-15rem)] max-w-3xl flex-col rounded-lg border bg-card shadow-sm">
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {msgs.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
              {m.role === "ai" && <div className="h-8 w-8 shrink-0 rounded-full bg-primary p-1.5 text-primary-foreground"><Bot className="h-5 w-5" /></div>}
              <div className={`group max-w-[85%] ${m.role === "user" ? "rounded-lg bg-primary px-4 py-2.5 text-primary-foreground" : ""}`}>
                {editing === i ? (
                  <textarea autoFocus rows={6} className={inputCls} value={m.text}
                    onChange={(e) => setMsgs((all) => all.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)))} />
                ) : (
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.text}</p>
                )}
                {m.role === "ai" && (
                  <button onClick={() => setEditing(editing === i ? null : i)}
                    className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                    {editing === i ? <><Check className="h-3 w-3" /> Done</> : <><Pencil className="h-3 w-3" /> Edit</>}
                  </button>
                )}
              </div>
            </div>
          ))}
          {loading && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Thinking…</div>}
          <div ref={end} />
        </div>
        {msgs.length === 1 && (
          <div className="flex flex-wrap gap-2 px-5 pb-3">
            {suggestions.map((s) => (
              <button key={s} onClick={() => send(s)} className="rounded-full border px-3 py-1 text-xs hover:bg-muted">{s}</button>
            ))}
          </div>
        )}
        <form className="flex gap-2 border-t p-3" onSubmit={(e) => { e.preventDefault(); send(input); }}>
          <input className={inputCls} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message…" />
          <button className={btnCls} disabled={loading || !input.trim()} aria-label="Send"><Send className="h-4 w-4" /></button>
        </form>
      </div>
    </AppShell>
  );
}
