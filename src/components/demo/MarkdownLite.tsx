import { Fragment, type ReactNode } from "react";

function renderInline(text: string, keyBase: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const codeParts = text.split(/(`[^`]+`)/g);
  codeParts.forEach((part, ci) => {
    if (part.startsWith("`") && part.endsWith("`") && part.length > 1) {
      nodes.push(
        <code key={`${keyBase}-c${ci}`} className="rounded bg-white/[0.06] px-1 py-0.5 font-mono text-[0.85em] text-atlas">
          {part.slice(1, -1)}
        </code>,
      );
      return;
    }
    const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
    boldParts.forEach((bp, bi) => {
      if (bp.startsWith("**") && bp.endsWith("**") && bp.length > 2) {
        nodes.push(
          <strong key={`${keyBase}-b${ci}-${bi}`} className="font-semibold text-white">
            {bp.slice(2, -2)}
          </strong>,
        );
      } else if (bp) {
        nodes.push(<Fragment key={`${keyBase}-t${ci}-${bi}`}>{bp}</Fragment>);
      }
    });
  });
  return nodes;
}

export function MarkdownLite({ text, className = "" }: { text: string; className?: string }) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === "") {
      blocks.push(<div key={key++} className="h-2" />);
      i++;
      continue;
    }
    blocks.push(
      <p key={key++} className="text-[13px] leading-relaxed text-slate-300">
        {renderInline(line, `p${key}`)}
      </p>,
    );
    i++;
  }
  return <div className={`space-y-0.5 ${className}`}>{blocks}</div>;
}
