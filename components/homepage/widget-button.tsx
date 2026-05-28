"use client";

import { useState } from "react";
import { TheLeModal } from "./the-le-modal";
import { WriteKudoModal } from "./write-kudo-modal";

const FONT = "var(--font-montserrat), Montserrat, sans-serif";

export function WidgetButton() {
  const [theLeOpen, setTheLeOpen] = useState(false);
  const [kudosOpen, setKudosOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        {/* Floating action pill — A: Widget Button */}
        <div
          className="flex items-center shadow-xl"
          style={{
            width: 105,
            height: 64,
            background: "#FFEA9E",
            borderRadius: "999px",
            overflow: "hidden",
            fontFamily: FONT,
          }}
        >
          {/* A.1: Nút viết 'kudos' (floating action) */}
          <button
            type="button"
            onClick={() => setKudosOpen(true)}
            className="flex-1 h-full flex items-center justify-center hover:bg-black/[0.07] transition-colors cursor-pointer"
            style={{ background: "transparent", border: "none", fontSize: "22px" }}
            aria-label="Viết Kudos"
            title="Viết Kudos"
          >
            ✏
          </button>

          {/* Divider */}
          <div style={{ width: 1, height: 32, background: "rgba(0,16,26,0.18)", flexShrink: 0 }} />

          {/* A.2: Nút nối 'thể lệ SAA' */}
          <button
            type="button"
            onClick={() => setTheLeOpen(true)}
            className="flex-1 h-full flex items-center justify-center hover:bg-black/[0.07] transition-colors cursor-pointer"
            style={{ background: "transparent", border: "none", fontSize: "22px" }}
            aria-label="Thể lệ SAA"
            title="Thể lệ SAA"
          >
            ⭐
          </button>
        </div>
      </div>

      {theLeOpen && (
        <TheLeModal
          onClose={() => setTheLeOpen(false)}
          onWriteKudos={() => { setTheLeOpen(false); setKudosOpen(true); }}
        />
      )}
      {kudosOpen && (
        <WriteKudoModal onClose={() => setKudosOpen(false)} />
      )}
    </>
  );
}
