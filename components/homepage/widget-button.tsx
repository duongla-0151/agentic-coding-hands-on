"use client";

import { useState } from "react";

export function WidgetButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Popover menu */}
      {open && (
        <div
          className="flex flex-col gap-1 rounded-xl overflow-hidden shadow-2xl mb-2"
          style={{
            background: "rgba(11, 15, 18, 0.97)",
            border: "1px solid #2E3940",
            minWidth: "160px",
          }}
        >
          <button
            className="px-4 py-3 text-sm text-white text-left hover:bg-white/10 transition-colors cursor-pointer"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            onClick={() => setOpen(false)}
          >
            ✏ Gửi Kudos
          </button>
          <button
            className="px-4 py-3 text-sm text-white text-left hover:bg-white/10 transition-colors cursor-pointer"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            onClick={() => setOpen(false)}
          >
            ⭐ Đề cử giải thưởng
          </button>
        </div>
      )}

      {/* Pill button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center gap-2 font-bold shadow-lg transition-transform hover:scale-105 cursor-pointer"
        style={{
          width: 105,
          height: 64,
          background: "#FFEA9E",
          borderRadius: "999px",
          fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
          fontSize: "22px",
          color: "#00101A",
        }}
        aria-label="Quick actions"
        aria-expanded={open}
      >
        <span aria-hidden="true">✏</span>
        <span aria-hidden="true">⭐</span>
      </button>
    </div>
  );
}
