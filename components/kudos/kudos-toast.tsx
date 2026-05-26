"use client";

const FONT = "var(--font-montserrat), Montserrat, sans-serif";

interface KudosToastProps {
  message: string;
  visible: boolean;
}

export function KudosToast({ message, visible }: KudosToastProps) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 32,
        left: "50%",
        transform: `translateX(-50%) translateY(${visible ? "0" : "24px"})`,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s ease, transform 0.3s ease",
        zIndex: 9999,
        background: "rgba(30,40,50,0.97)",
        border: "1px solid rgba(255,234,158,0.3)",
        borderRadius: 999,
        padding: "12px 28px",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <span
        style={{
          fontFamily: FONT,
          fontSize: 14,
          color: "#FFEA9E",
          whiteSpace: "nowrap",
        }}
      >
        {message}
      </span>
    </div>
  );
}
