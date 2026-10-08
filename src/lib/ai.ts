// Lightweight on-device "AI" text generator. No network, no backend, no data stored.
export type Tone = "Formal" | "Friendly" | "Persuasive";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export async function generateEmail(o: {
  recipient: string;
  subject: string;
  points: string;
  tone: Tone;
}): Promise<string> {
  await delay(700);
  const name = o.recipient.trim() || "there";
  const subject = o.subject.trim() || "Follow-up";
  const points = o.points
    .split(/\n|\.\s/)
    .map((p) => p.trim().replace(/\.$/, ""))
    .filter(Boolean);
  const body = points.length ? points : ["I wanted to reach out regarding the matter above"];

  const t = {
    Formal: {
      greet: `Dear ${name},`,
      open: `I hope this message finds you well. I am writing regarding ${subject.toLowerCase()}.`,
      close: "Please do not hesitate to contact me should you require any further information.",
      sign: "Kind regards,",
    },
    Friendly: {
      greet: `Hi ${name},`,
      open: `Hope you're doing well! Just wanted to touch base about ${subject.toLowerCase()}.`,
      close: "Let me know what you think — happy to chat anytime!",
      sign: "Cheers,",
    },
    Persuasive: {
      greet: `Hi ${name},`,
      open: `I'd like to share an opportunity around ${subject.toLowerCase()} that I believe can make a real difference for us.`,
      close: "Could we set up a quick 15-minute call this week to move this forward? I'm confident it will be worth your time.",
      sign: "Best regards,",
    },
  }[o.tone];

  const lines = body.map((p) => (o.tone === "Formal" ? `• ${cap(p)}.` : `• ${cap(p)}`)).join("\n");
  return `Subject: ${subject}\n\n${t.greet}\n\n${t.open}\n\n${lines}\n\n${t.close}\n\n${t.sign}\n[Your Name]`;
}

export async function researchTopic(input: string): Promise<string> {
  await delay(900);
  const text = input.trim();
  const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => s.length > 20);
  const isArticle = sentences.length >= 3;
  const topic = isArticle ? (sentences[0] ?? "").slice(0, 80) : text;

  const words = text.toLowerCase().match(/[a-z]{5,}/g) ?? [];
  const freq: Record<string, number> = {};
  words.forEach((w) => (freq[w] = (freq[w] ?? 0) + 1));
  const keywords = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([w]) => w);

  const summary = isArticle
    ? sentences.slice(0, 3).join(" ")
    : `${cap(topic)} is an area attracting growing attention in modern workplaces. It combines strategy, process and technology, and organisations adopting it typically focus on efficiency, collaboration and measurable outcomes.`;

  return `## Summary
${summary}

## Key Insights
- Core themes: ${keywords.length ? keywords.join(", ") : topic}.
- Early, small-scale adoption usually delivers faster learning than large rollouts.
- Success depends on clear ownership, stakeholder buy-in and defined metrics.
- Risks include unclear goals, change fatigue and poor data quality.

## Recommendations
1. Define 2–3 measurable objectives related to ${topic.toLowerCase()}.
2. Run a 4–6 week pilot with a small, motivated team.
3. Gather feedback weekly and document lessons learned.
4. Verify facts with trusted, up-to-date sources before decisions.`;
}

export async function chatReply(msg: string): Promise<string> {
  await delay(600);
  const m = msg.toLowerCase();
  if (/meeting|agenda/.test(m))
    return "Here's a quick meeting agenda template:\n\n1. Objective (2 min)\n2. Updates from each owner (10 min)\n3. Key decisions needed (10 min)\n4. Action items & owners (5 min)\n\nTip: share it 24 hours in advance.";
  if (/priorit|task|todo|to-do|busy|overwhelm/.test(m))
    return "Try the Eisenhower Matrix:\n\n• Urgent + Important → do now\n• Important, not urgent → schedule\n• Urgent, not important → delegate\n• Neither → drop\n\nPick your top 3 tasks for today and block focus time for them.";
  if (/focus|productiv|distract/.test(m))
    return "To boost focus:\n\n• Work in 25–50 minute blocks with short breaks\n• Silence notifications during deep work\n• Batch emails to 2–3 set times a day\n• End each day by planning tomorrow's top 3";
  if (/email/.test(m))
    return "For emails, try the Email Generator in the sidebar — pick a tone and add your key points. Keep subject lines under 8 words and put the main ask in the first two lines.";
  if (/hello|hi\b|hey/.test(m))
    return "Hello! I'm your workplace assistant. Ask me about planning meetings, prioritising tasks, staying focused, or writing communication.";
  if (/feedback|review/.test(m))
    return "Use the SBI model for feedback:\n\n• Situation — when and where\n• Behaviour — what you observed\n• Impact — the effect it had\n\nKeep it specific, timely and focused on behaviour, not personality.";
  return `Good question about "${msg.slice(0, 60)}". A practical approach:\n\n1. Clarify the goal and who it affects\n2. Break it into small, actionable steps\n3. Assign owners and deadlines\n4. Review progress regularly\n\nWant me to help with a specific part?`;
}
