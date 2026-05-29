"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

const SAA_ICONS = [
  { label: "REVIVAL",             img: "/images/badges/revival.png" },
  { label: "TOUCH OF LIGHT",      img: "/images/badges/touch-of-light.png" },
  { label: "STAY GOLD",           img: "/images/badges/stay-gold.png" },
  { label: "FLOW TO HORIZON",     img: "/images/badges/flow-to-horizon.png" },
  { label: "BEYOND THE BOUNDARY", img: "/images/badges/beyond-the-boundary.png" },
  { label: "ROOT FURTHER",        img: "/images/badges/root-further.png" },
];

const FONT = "var(--font-montserrat), Montserrat, sans-serif";

interface TheLeModalProps {
  onClose: () => void;
  onWriteKudos: () => void;
}

export function TheLeModal({ onClose, onWriteKudos }: TheLeModalProps) {
  const t = useTranslations("TheLeModal");

  const HERO_TIERS = [
    {
      label: "New Hero",
      img: "/images/hero-badges/new-hero.png",
      condition: t("newHeroCondition"),
      desc: t("newHeroDesc"),
    },
    {
      label: "Rising Hero",
      img: "/images/hero-badges/rising-hero.png",
      condition: t("risingHeroCondition"),
      desc: t("risingHeroDesc"),
    },
    {
      label: "Super Hero",
      img: "/images/hero-badges/super-hero.png",
      condition: t("superHeroCondition"),
      desc: t("superHeroDesc"),
    },
    {
      label: "Legend Hero",
      img: "/images/hero-badges/legend-hero.png",
      condition: t("legendHeroCondition"),
      desc: t("legendHeroDesc"),
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="flex flex-col h-full overflow-hidden shadow-2xl"
        style={{ width: "min(520px, 100vw)", background: "#061520", borderLeft: "1px solid rgba(255,234,158,0.15)" }}
        role="dialog"
        aria-modal="true"
        aria-label={t("ariaLabel")}
      >
        {/* Header */}
        <div className="shrink-0 px-8 pt-8 pb-4">
          <h2 className="font-black" style={{ fontFamily: FONT, fontSize: "32px", fontWeight: 900, color: "#FFEA9E" }}>
            {t("title")}
          </h2>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-8 pb-4 flex flex-col gap-8">

          {/* Section 1: Recipient */}
          <section>
            <h3 className="font-black uppercase mb-3" style={{ fontFamily: FONT, fontSize: "13px", fontWeight: 900, color: "#FFEA9E", lineHeight: 1.4 }}>
              {t("recipientSection")}
            </h3>
            <p className="text-white/60 mb-4" style={{ fontFamily: FONT, fontSize: "13px", lineHeight: 1.7 }}>
              {t("recipientDesc")}
            </p>
            <div className="flex flex-col gap-4">
              {HERO_TIERS.map((tier) => (
                <div key={tier.label} className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <Image
                      src={tier.img}
                      alt={tier.label}
                      width={110}
                      height={20}
                      className="shrink-0"
                      style={{ objectFit: "contain", objectPosition: "left" }}
                    />
                    <span className="text-white/80 text-xs font-semibold" style={{ fontFamily: FONT }}>
                      {tier.condition}
                    </span>
                  </div>
                  <p className="text-white/50 text-xs leading-relaxed" style={{ fontFamily: FONT }}>
                    {tier.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: Sender */}
          <section>
            <h3 className="font-black uppercase mb-3" style={{ fontFamily: FONT, fontSize: "13px", fontWeight: 900, color: "#FFEA9E", lineHeight: 1.4 }}>
              {t("senderSection")}
            </h3>
            <p className="text-white/60 mb-5" style={{ fontFamily: FONT, fontSize: "13px", lineHeight: 1.7 }}>
              {t("senderDesc")}
            </p>
            <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
              {SAA_ICONS.map((icon) => (
                <div key={icon.label} className="flex flex-col items-center gap-2">
                  <Image
                    src={icon.img}
                    alt={icon.label}
                    width={80}
                    height={104}
                    style={{ objectFit: "contain" }}
                  />
                  <span className="text-white/60 text-center uppercase" style={{ fontFamily: FONT, fontSize: "9px", fontWeight: 700, letterSpacing: "0.05em" }}>
                    {icon.label}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-white/50 mt-4 text-xs" style={{ fontFamily: FONT, lineHeight: 1.7 }}>
              {t("senderFooter")}
            </p>
          </section>

          {/* Section 3: National Kudos */}
          <section>
            <h3 className="font-black uppercase mb-3" style={{ fontFamily: FONT, fontSize: "13px", fontWeight: 900, color: "#FFEA9E" }}>
              {t("nationalKudos")}
            </h3>
            <p className="text-white/60 text-xs" style={{ fontFamily: FONT, lineHeight: 1.7 }}>
              {t("nationalKudosDesc")}
            </p>
          </section>
        </div>

        {/* Sticky footer */}
        <div
          className="shrink-0 flex items-center gap-3 px-8 py-5"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)", background: "#061520" }}
        >
          <button
            onClick={onClose}
            className="flex items-center gap-2 font-bold transition-colors hover:bg-white/10 rounded-full"
            style={{ fontFamily: FONT, fontSize: "13px", fontWeight: 700, color: "rgba(255,255,255,0.7)", border: "1.5px solid rgba(255,255,255,0.2)", padding: "10px 20px" }}
          >
            <span aria-hidden="true">✕</span> {t("close")}
          </button>
          <button
            onClick={onWriteKudos}
            className="flex-1 flex items-center justify-center gap-2 font-bold rounded-full transition-opacity hover:opacity-85"
            style={{ fontFamily: FONT, fontSize: "13px", fontWeight: 700, background: "#FFEA9E", color: "#00101A", padding: "10px 20px" }}
          >
            <span aria-hidden="true">✏</span> {t("writeKudos")}
          </button>
        </div>
      </div>
    </div>
  );
}
