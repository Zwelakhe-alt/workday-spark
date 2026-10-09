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

type Topic = { re: RegExp; name: string; summary: string; insights: string[]; recs: string[] };

const TOPICS: Topic[] = [
  { re: /health|medical|hospital|patient|clinic|doctor|nurs/, name: "healthcare",
    summary: "Healthcare organisations balance patient outcomes, staff capacity and strict regulation. New tools must prove clinical safety and protect patient data.",
    insights: ["Patient safety and clinical accuracy must be validated before any new tool or process is adopted.", "Patient records are highly sensitive, so privacy rules (e.g. POPIA, HIPAA) shape every decision.", "Reducing admin load on clinicians frees time for direct patient care."],
    recs: ["Pilot in one department with clinician oversight.", "Run a data-privacy impact assessment.", "Track patient outcomes and staff time saved."] },
  { re: /educat|school|teach|student|learning|training|universit/, name: "education & training",
    summary: "Effective learning programmes combine clear objectives, practice and feedback. Engagement drops quickly when content is passive or irrelevant.",
    insights: ["Short, practical modules are completed far more often than long courses.", "Learners retain more when they apply skills immediately.", "Measuring behaviour change matters more than completion rates."],
    recs: ["Define 3 learning outcomes.", "Break content into 10–15 minute modules.", "Measure skills before and after."] },
  { re: /hybrid|remote|work from home|wfh|office return/, name: "hybrid & remote work",
    summary: "Flexible work models mix office and remote days. Done well, they raise retention and focus time; done poorly, they fragment collaboration and create proximity bias.",
    insights: ["Teams agreeing shared 'anchor days' collaborate better than fully ad-hoc schedules.", "Async-first documentation reduces meeting load across locations.", "Managers need clear output-based goals rather than visibility-based judgement."],
    recs: ["Set 1–2 team anchor days per week.", "Publish a written policy covering eligibility, core hours and equipment.", "Review engagement and output metrics quarterly."] },
  { re: /\bai\b|artificial intelligence|machine learning|chatgpt|automation|generative/, name: "AI & automation",
    summary: "AI and automation tools speed up drafting, analysis and repetitive tasks. Value depends on picking well-defined use cases and keeping human review in place.",
    insights: ["Biggest early gains come from writing, summarising and data clean-up tasks.", "Outputs can be confidently wrong, so review steps are essential.", "Data privacy and clear usage policies are the main adoption blockers."],
    recs: ["List 3 repetitive tasks and test AI on one of them.", "Create an acceptable-use policy covering sensitive data.", "Measure time saved versus error rate before scaling."] },
  { re: /market|brand|social media|seo|campaign|advertis|content/, name: "marketing",
    summary: "Effective marketing aligns a clear audience, a consistent message and measurable channels. Focus beats trying to be present everywhere.",
    insights: ["One or two well-run channels usually outperform many neglected ones.", "Customer language from reviews and interviews makes the strongest copy.", "Attribution is imperfect, so track trends rather than single numbers."],
    recs: ["Define one ideal customer profile.", "Pick two channels and set monthly targets.", "Review cost per lead and conversion every month."] },
  { re: /sales|revenue|deal|pipeline|prospect|lead|client acquisition/, name: "sales",
    summary: "Sales performance depends on a healthy pipeline, qualified leads and consistent follow-up. Most lost deals stall from lack of next steps.",
    insights: ["Speed of first response strongly affects conversion.", "Qualifying early saves time on deals that will not close.", "Every meeting should end with an agreed next step and date."],
    recs: ["Define clear pipeline stages and exit criteria.", "Follow up within 24 hours of every contact.", "Review stalled deals weekly."] },
  { re: /financ|budget|cost|expense|cash flow|profit|invest|pricing/, name: "finance & budgeting",
    summary: "Sound financial management means knowing where money goes, forecasting ahead and protecting cash flow. Small recurring costs often add up unnoticed.",
    insights: ["Cash flow problems sink more businesses than lack of profit.", "Recurring subscriptions are a common hidden cost.", "Rolling forecasts adapt better than fixed annual budgets."],
    recs: ["Audit recurring expenses this month.", "Build a simple 13-week cash flow forecast.", "Compare actuals vs budget monthly."] },
  { re: /hiring|recruit|interview|onboard|talent|employee|staff|hr\b|human resource|retention|turnover/, name: "people & hiring",
    summary: "Strong people practices cover fair hiring, good onboarding and ongoing development. Turnover is expensive, so retention matters as much as recruitment.",
    insights: ["Structured interviews predict performance better than informal chats.", "The first 90 days strongly shape whether new hires stay.", "Career growth and recognition drive retention more than perks."],
    recs: ["Use a scorecard for every role you hire.", "Create a 30-60-90 day onboarding plan.", "Hold regular career conversations, not just annual reviews."] },
  { re: /leader|manag|team building|culture|motivat|morale|engagement/, name: "leadership & team culture",
    summary: "Good leadership sets direction, removes blockers and builds trust. Culture is shaped by what leaders reward and tolerate, not by values posters.",
    insights: ["Psychological safety is the strongest predictor of team performance.", "Regular 1:1s catch problems early.", "Clear priorities reduce stress more than extra resources."],
    recs: ["Hold weekly 30-minute 1:1s.", "Share the top 3 team priorities each quarter.", "Recognise good work publicly and specifically."] },
  { re: /project|agile|scrum|deadline|milestone|roadmap|kanban|planning/, name: "project management",
    summary: "Projects succeed with clear scope, owners and regular check-ins. Most delays trace back to unclear requirements or hidden dependencies.",
    insights: ["Breaking work into 1–2 week chunks exposes risks early.", "One named owner per task prevents dropped work.", "Scope creep is the most common cause of overruns."],
    recs: ["Write a one-page project brief with scope and success criteria.", "Use a visible task board.", "Run a short weekly status review."] },
  { re: /customer|client service|support|satisfaction|complaint|experience|cx/, name: "customer experience",
    summary: "Customer experience covers every interaction a customer has with you. Fast, consistent and empathetic responses build loyalty.",
    insights: ["Response speed is the top driver of satisfaction.", "Recurring complaints point to fixable process issues.", "Keeping existing customers is cheaper than winning new ones."],
    recs: ["Set response-time targets and track them.", "Tag and review complaint themes monthly.", "Ask for feedback after key interactions."] },
  { re: /security|cyber|phishing|password|data protection|privacy|gdpr|popia|hack/, name: "cybersecurity & data privacy",
    summary: "Most security incidents start with human error such as phishing or weak passwords. Simple controls prevent the majority of attacks.",
    insights: ["Multi-factor authentication blocks most account takeovers.", "Regular staff training reduces phishing success.", "Privacy laws like POPIA and GDPR require clear data handling."],
    recs: ["Turn on MFA for all work accounts.", "Run short phishing awareness training.", "Map what personal data you hold and who can access it."] },
  { re: /sustainab|esg|climate|green|carbon|environment/, name: "sustainability",
    summary: "Workplace sustainability reduces environmental impact and is increasingly expected by customers, staff and investors.",
    insights: ["Energy, travel and procurement are usually the biggest impact areas.", "Measurable targets build more credibility than broad pledges.", "Staff engagement drives lasting behaviour change."],
    recs: ["Measure a baseline for energy and travel.", "Set one measurable target for this year.", "Report progress openly."] },
  { re: /productiv|time management|focus|efficien|burnout|wellbeing|well-being|stress/, name: "productivity & wellbeing",
    summary: "Sustainable productivity balances focused work, sensible workloads and recovery time. Constant busyness often hides low-value work.",
    insights: ["Context switching can cost a large share of productive time.", "Protected focus blocks improve output quality.", "Chronic overwork leads to burnout and errors."],
    recs: ["Block 2 focus hours daily.", "Batch email and messages at set times.", "Review workloads monthly to spot overload."] },
];

const STOP = new Set("about after again also because being between could does doing during every from have having into just more most other over should their there these they this those through under until very what when where which while with would your yours want need help tell explain please".split(" "));
const keyTerms = (t: string) => {
  const words = t.toLowerCase().match(/[a-z]{4,}/g) ?? [];
  const freq: Record<string, number> = {};
  words.filter((w) => !STOP.has(w)).forEach((w) => (freq[w] = (freq[w] ?? 0) + 1));
  return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([w]) => w);
};

export async function researchTopic(input: string): Promise<string> {
  await delay(900);
  const text = input.trim();
  const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => s.length > 20);
  const isArticle = sentences.length >= 3;
  const lower = text.toLowerCase();
  const terms = keyTerms(text);
  const topic = isArticle ? terms.slice(0, 3).join(", ") : text.replace(/[?.!]+$/, "");
  const match = TOPICS.find((t) => t.re.test(lower));

  if (isArticle) {
    const scored = sentences.map((s, i) => ({ s, i, score: keyTerms(s).filter((w) => terms.includes(w)).length + (i === 0 ? 1 : 0) }));
    const top = [...scored].sort((a, b) => b.score - a.score).slice(0, 3).sort((a, b) => a.i - b.i).map((x) => x.s);
    const nums = text.match(/[^.!?]*\d[\d,.%]*[^.!?]*[.!?]/g)?.slice(0, 2) ?? [];
    return `## Summary
${top.join(" ")}

## Key Insights
- Main themes: ${terms.join(", ")}.
${nums.map((n) => `- Key figure: ${n.trim()}`).join("\n")}
${match ? match.insights.slice(0, 2).map((i) => `- ${i}`).join("\n") : `- The article returns most often to "${terms[0]}", suggesting it is the central point.`}
- Length: ${sentences.length} sentences, about ${text.split(/\s+/).length} words.

## Recommendations
${(match ? match.recs : [`Identify what "${terms[0]}" means for your team specifically.`, "Check the claims against a second trusted source.", "Share the key points with stakeholders and agree next steps."]).map((r, i) => `${i + 1}. ${r}`).join("\n")}
4. Verify facts with trusted, up-to-date sources before decisions.`;
  }

  const m = match;
  const points = m
    ? m.insights.map((x, k) => k === 0 ? `${x} This is central to ${topic}.` : x)
    : [
        `Clarify what success looks like for ${topic}: define 2–3 measurable goals before investing time or budget.`,
        `Map who ${topic} affects — teams, customers and partners — and gather their input early.`,
        `Start ${topic} with a small pilot, track results, and verify facts with trusted, up-to-date sources.`,
      ];
  return `## ${cap(topic)}${m ? ` (${m.name})` : ""}

${points.map((x) => `- ${x}`).join("\n")}`;
}

type Intent = { re: RegExp; reply: string };
const INTENTS: Intent[] = [
  { re: /meeting|agenda/, reply: "Meeting agenda template:\n\n1. Objective (2 min)\n2. Updates from each owner (10 min)\n3. Key decisions needed (10 min)\n4. Action items & owners (5 min)\n\nShare it 24 hours ahead and end with written action items." },
  { re: /priorit|to-?do|overwhelm|too much work|busy/, reply: "Try the Eisenhower Matrix:\n\n• Urgent + Important → do now\n• Important, not urgent → schedule\n• Urgent, not important → delegate\n• Neither → drop\n\nPick your top 3 tasks for today and block time for them." },
  { re: /focus|distract|procrastinat/, reply: "To beat distraction:\n\n• Work in 25–50 minute blocks (Pomodoro)\n• Silence notifications and close extra tabs\n• Start with the smallest next step to beat procrastination\n• Batch emails to 2–3 set times a day" },
  { re: /burnout|stress|tired|exhaust|wellbeing|mental health/, reply: "Signs of burnout include constant fatigue, cynicism and dropping performance.\n\n• Talk to your manager about workload early\n• Protect breaks and a hard stop time\n• Say no to low-value requests\n• Use your leave — and disconnect while on it\n\nIf it feels serious, reach out to a health professional or your company's wellness programme." },
  { re: /feedback|criticis/, reply: "Use the SBI model:\n\n• Situation — when and where\n• Behaviour — what you observed\n• Impact — the effect it had\n\nExample: \"In Monday's client call, you interrupted twice, which made the client hesitant to share concerns.\" Then ask: \"How do you see it?\"" },
  { re: /performance review|appraisal|self.?assessment/, reply: "For a performance review:\n\n1. List 3–5 achievements with measurable results\n2. Note one or two growth areas honestly\n3. Link your work to team goals\n4. Prepare questions about next-year goals and development" },
  { re: /raise|salary|pay rise|promotion|negotiat/, reply: "To ask for a raise or promotion:\n\n1. Research market pay for your role\n2. Prepare evidence: results, extra responsibilities, impact\n3. Book a dedicated meeting — not a hallway chat\n4. State a specific figure or role\n5. If the answer is no, ask what you'd need to achieve and by when" },
  { re: /conflict|disagree|difficult (colleague|coworker|person|boss)|argument/, reply: "To handle workplace conflict:\n\n1. Talk privately and early\n2. Describe the issue, not the person\n3. Listen to their view fully before replying\n4. Agree on a concrete next step\n5. Escalate to a manager or HR only if it continues" },
  { re: /delegat/, reply: "To delegate well:\n\n• Choose tasks others can do 80% as well as you\n• Explain the outcome, deadline and why it matters\n• Agree check-in points instead of micromanaging\n• Give credit when it's done" },
  { re: /interview|job hunt|cv|resume|cover letter/, reply: "Interview tips:\n\n• Research the company and role\n• Prepare 3–4 STAR stories (Situation, Task, Action, Result)\n• Have 2–3 questions for them\n• Follow up with a thank-you email within 24 hours" },
  { re: /present|presentation|slides|public speaking/, reply: "For a strong presentation:\n\n1. Start with the key message in one sentence\n2. Limit to 3 main points\n3. One idea per slide, minimal text\n4. Rehearse out loud twice\n5. End with a clear ask or next step" },
  { re: /email|message|write to/, reply: "For emails, use the Email Generator in the sidebar. Quick tips: subject under 8 words, main ask in the first two lines, one topic per email, and a clear deadline if you need a reply." },
  { re: /deadline|late|behind schedule|overdue/, reply: "If you're behind on a deadline:\n\n1. Tell stakeholders early — don't wait\n2. Say what's done, what's left and a realistic new date\n3. Offer options: reduced scope or extra help\n4. Cut non-essential tasks until it's delivered" },
  { re: /onboard|new job|first day|new hire|new role/, reply: "For a new role:\n\n• Week 1: meet your team and learn the tools\n• First month: understand priorities and quick wins\n• By 90 days: deliver a visible result\n\nAsk your manager what success looks like at 30, 60 and 90 days." },
  { re: /team|motivat|morale|engag/, reply: "To boost team morale:\n\n• Recognise good work specifically and publicly\n• Hold regular 1:1s\n• Share why the work matters\n• Remove blockers fast\n• Ask the team what would help them most" },
  { re: /remote|hybrid|work from home|wfh/, reply: "Remote/hybrid work tips:\n\n• Set clear working hours and stick to them\n• Over-communicate progress in writing\n• Keep cameras on for key discussions\n• Have a dedicated workspace\n• Schedule informal chats to stay connected" },
  { re: /time management|schedule|calendar|plan my (day|week)/, reply: "Plan your week in 15 minutes:\n\n1. List all tasks and deadlines\n2. Pick 3 key outcomes for the week\n3. Block focus time in your calendar first\n4. Fit meetings around it\n5. Review every Friday" },
  { re: /project|scope|stakeholder/, reply: "For a project:\n\n1. Write a one-page brief: goal, scope, deadline, owner\n2. Break work into 1–2 week tasks\n3. Assign one owner per task\n4. Hold a short weekly check-in\n5. Log changes to scope in writing" },
  { re: /report|summary|document/, reply: "For a work report:\n\n1. Start with a 3-line executive summary\n2. Key findings with data\n3. Recommendations\n4. Next steps and owners\n\nKeep it short; put detail in an appendix. The Research Assistant can help summarise source material." },
  { re: /\bai\b|chatgpt|automation/, reply: "Good uses of AI at work: drafting emails, summarising documents, brainstorming and data clean-up.\n\nAlways review the output, never paste confidential data into public AI tools, and check your company's AI policy." },
  { re: /^(hello|hi|hey|good (morning|afternoon|evening))\b/, reply: "Hello! Ask me about meetings, priorities, focus, feedback, conflict, raises, presentations, deadlines, delegation, remote work or burnout." },
  { re: /thank/, reply: "You're welcome! Anything else I can help with?" },
];

export async function chatReply(msg: string): Promise<string> {
  await delay(600);
  const m = msg.toLowerCase();
  const hit = INTENTS.find((i) => i.re.test(m));
  if (hit) return hit.reply;
  const terms = keyTerms(msg);
  const about = terms.length ? `"${terms.slice(0, 2).join(" ")}"` : "that";
  return `I don't have built-in guidance on ${about} yet, and I'd rather not give you a generic answer.\n\nI can help with: meetings, prioritising, focus, burnout, feedback, performance reviews, raises & promotions, conflict, delegation, interviews, presentations, emails, deadlines, onboarding, team morale, remote work, planning, projects, reports and AI at work.\n\nTry rephrasing with one of these topics.`;
}
