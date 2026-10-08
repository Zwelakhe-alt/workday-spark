import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { ghostBtnCls } from "./AppShell";

export function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  if (!text) return null;
  return (
    <button
      className={ghostBtnCls}
      onClick={() => {
        navigator.clipboard.writeText(text);
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }}
    >
      {done ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} {done ? "Copied" : "Copy"}
    </button>
  );
}
