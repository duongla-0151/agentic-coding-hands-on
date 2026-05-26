"use client";

import { useRef, useCallback, useState } from "react";

const FONT = "var(--font-montserrat), Montserrat, sans-serif";

const FORMAT_TOOLS = [
  { label: "B", cmd: "bold", style: { fontWeight: 900 } },
  { label: "I", cmd: "italic", style: { fontStyle: "italic" as const } },
  { label: "S", cmd: "strikeThrough", style: { textDecoration: "line-through" } },
  { label: "≡", cmd: "insertOrderedList", style: {} },
  { label: "🔗", cmd: "link", style: {} },
  { label: "❝", cmd: "formatBlock", arg: "blockquote", style: {} },
];

interface KudoRichEditorProps {
  onChange: (html: string) => void;
  onBlur?: () => void;
}

export function KudoRichEditor({ onChange, onBlur }: KudoRichEditorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hasContent, setHasContent] = useState(false);

  const exec = useCallback(
    (cmd: string, arg?: string) => {
      ref.current?.focus();
      if (cmd === "link") {
        const url = window.prompt("Nhập URL:");
        if (url && /^https?:\/\//i.test(url)) document.execCommand("createLink", false, url);
      } else {
        document.execCommand(cmd, false, arg);
      }
      onChange(ref.current?.innerHTML ?? "");
    },
    [onChange]
  );

  return (
    <div style={{ border: "1px solid #998C5F", borderRadius: 8, background: "#fff", overflow: "hidden" }}>
      {/* Toolbar: formatting buttons left + "Tiêu chuẩn cộng đồng" right */}
      <div style={{ display: "flex", alignItems: "stretch", borderBottom: "1px solid rgba(153,140,95,0.25)", background: "#FAFAF5" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 2, padding: "6px 8px", flex: 1 }}>
          {FORMAT_TOOLS.map(({ label, cmd, arg, style }) => (
            <button
              key={cmd}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); exec(cmd, arg); }}
              style={{
                fontFamily: FONT, fontSize: 14, color: "#00101A",
                padding: "5px 9px", border: "none", borderRadius: 4,
                cursor: "pointer", background: "transparent",
                ...style,
              }}
            >
              {label}
            </button>
          ))}
        </div>
        {/* "Tiêu chuẩn cộng đồng" — styled as per Figma: #E46060, 16px bold, left-bordered */}
        <button
          type="button"
          style={{
            fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "rgba(228,96,96,1)",
            padding: "10px 16px", background: "transparent", cursor: "pointer",
            border: "none", borderLeft: "1px solid #998C5F",
            whiteSpace: "nowrap",
          }}
        >
          Tiêu chuẩn cộng đồng
        </button>
      </div>

      {/* Editable area */}
      <div style={{ position: "relative" }}>
        <div
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => {
            const el = e.currentTarget as HTMLDivElement;
            setHasContent((el.textContent?.trim() ?? "").length > 0);
            onChange(el.innerHTML);
          }}
          onBlur={() => onBlur?.()}
          style={{
            fontFamily: FONT, fontSize: 14, color: "#00101A",
            padding: "12px 16px", minHeight: 160, outline: "none", lineHeight: 1.6,
          }}
        />
        {!hasContent && (
          <span
            style={{
              position: "absolute", top: 12, left: 16,
              color: "rgba(0,16,26,0.35)", fontFamily: FONT, fontSize: 14,
              pointerEvents: "none", userSelect: "none",
            }}
          >
            Hãy gửi gắm lời cám ơn và ghi nhận đến đồng đội tại đây nhé!
          </span>
        )}
      </div>
    </div>
  );
}
