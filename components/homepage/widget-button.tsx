"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { TheLeModal } from "./the-le-modal";
import { WriteKudoModal } from "./write-kudo-modal";

function PencilIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931zm0 0L19.5 7.125" stroke="rgba(0,16,26,0.75)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function SaaMarkIcon() {
  return (
    <svg width="22" height="18" viewBox="0 0 82 75" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50.8734 23.4125C51.721 22.7241 64.1243 12.5821 80.0739 0.374931C80.2815 0.206662 80.0739 -0.0839847 79.8144 0.0230956C72.4624 3.34258 57.6891 6.40202 57.6891 6.40202L27.3814 11.3889C17.054 13.2552 16.1025 14.7849 11.9335 20.7202L10.8264 22.2652C10.7745 22.3417 9.00998 25.1564 3.33594 33.8605C5.06583 31.2141 7.02061 30.9999 18.6455 29.0724C20.8597 28.6594 26.1359 27.5886 29.44 26.992C34.0242 26.166 49.6451 23.6266 50.7523 23.4431C50.8042 23.4431 50.8215 23.4278 50.8561 23.3972L50.8734 23.4125Z" fill="#E73928"/>
      <path d="M11.8671 45.9149L0 64.7763L23.3016 59.9118C33.6118 57.9996 34.5632 56.4699 38.715 50.5193L39.8221 48.959C39.8221 48.959 41.1541 47.1539 46.8801 38.2969C45.254 40.928 38.8707 40.8821 31.9857 42.1977C29.7714 42.626 11.8844 45.9149 11.8844 45.9149H11.8671Z" fill="#E73928"/>
      <path d="M21.104 24.5583L44.3711 31.9774C46.7237 32.7882 48.765 35.4193 46.8794 38.2799C45.6339 40.4368 36.3444 49.3856 36.3444 49.3856C36.2925 49.5539 6.33075 39.7178 6.33075 39.7178C3.8916 38.8918 2.47309 36.6431 3.26884 34.0273C4.06459 31.4114 18.2843 23.564 21.104 24.543V24.5583Z" fill="#B72927"/>
    </svg>
  );
}

export function WidgetButton() {
  const [theLeOpen, setTheLeOpen] = useState(false);
  const [kudosOpen, setKudosOpen] = useState(false);
  const t = useTranslations("WidgetButton");

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
          }}
        >
          {/* A.1: Nút viết 'kudos' (floating action) */}
          <button
            type="button"
            onClick={() => setKudosOpen(true)}
            className="flex-1 h-full flex items-center justify-center hover:bg-black/[0.07] transition-colors cursor-pointer"
            style={{ background: "transparent", border: "none" }}
            aria-label={t("writeKudos")}
            title={t("writeKudos")}
          >
            <PencilIcon />
          </button>

          {/* Divider */}
          <div style={{ width: 1, height: 32, background: "rgba(0,16,26,0.18)", flexShrink: 0 }} />

          {/* A.2: Nút nối 'thể lệ SAA' */}
          <button
            type="button"
            onClick={() => setTheLeOpen(true)}
            className="flex-1 h-full flex items-center justify-center hover:bg-black/[0.07] transition-colors cursor-pointer"
            style={{ background: "transparent", border: "none" }}
            aria-label={t("saaRules")}
            title={t("saaRules")}
          >
            <SaaMarkIcon />
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
