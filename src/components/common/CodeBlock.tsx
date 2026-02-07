import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  variant?: "before" | "after" | "neutral";
  showLineNumbers?: boolean;
}

export default function CodeBlock({
  code,
  variant = "neutral",
  showLineNumbers = true,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split("\n");

  const bgClass =
    variant === "before"
      ? "border-code-red/20 bg-code-red/[0.04]"
      : variant === "after"
      ? "border-code-green/20 bg-code-green/[0.04]"
      : "border-border bg-code-bg";

  return (
    <div className={`group relative rounded-lg border ${bgClass} overflow-hidden`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 px-3 py-1.5">
        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          {variant === "before" ? "Before" : variant === "after" ? "After" : "Code"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-accent transition-all"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-success" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <pre className="overflow-x-auto p-3 text-xs leading-relaxed">
        <code className="font-mono">
          {lines.map((line, i) => (
            <div key={i} className="flex">
              {showLineNumbers && (
                <span className="mr-4 inline-block w-6 select-none text-right text-muted-foreground/40 tabular-nums">
                  {i + 1}
                </span>
              )}
              <span className="text-foreground/90">{line}</span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}
