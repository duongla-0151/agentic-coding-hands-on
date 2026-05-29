"use client";

import { useTranslations } from "next-intl";
import { HeroBadgeChip } from "@/components/kudos/hero-badge-chip";
import type { HeroBadgeTier } from "@/lib/kudos/hero-badge";

const FONT = "var(--font-montserrat), Montserrat, sans-serif";
const YELLOW = "#FFEA9E";
const KV_BG =
  "url('/images/keyvisual/keyvisual-bg.png') lightgray -0.163px -909.862px / 101.245% 393.038% no-repeat";
const KV_OVERLAY =
  "linear-gradient(25deg, #00101A 14.74%, rgba(0,19,32,0.00) 47.8%)";

interface ProfileUser {
  name: string;
  avatar: string | null;
  department: string | null;
  kudos_count: number;
}

interface ProfileHeroProps {
  user: ProfileUser;
  /** When provided, renders "Send kudos to [name]" CTA button */
  onSendKudos?: () => void;
}

/** Ordered badge tiers — each slot unlocked when kudos_count >= threshold */
const BADGE_SLOTS: { tier: HeroBadgeTier; threshold: number; label: string }[] = [
  { tier: "new-hero",     threshold: 1,  label: "New Hero" },
  { tier: "rising-hero",  threshold: 5,  label: "Rising Hero" },
  { tier: "super-hero",   threshold: 10, label: "Super Hero" },
  { tier: "legend-hero",  threshold: 21, label: "Legend Hero" },
];

function IconSlot({ tier, label }: { tier?: HeroBadgeTier; label?: string }) {
  if (tier) {
    return (
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          overflow: "hidden",
          border: "1.5px solid rgba(255,234,158,0.45)",
          flexShrink: 0,
          background: "rgba(255,234,158,0.1)",
        }}
        title={label}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/images/hero-badges/${tier}.png`}
          alt={label ?? tier}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    );
  }
  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.18)",
        flexShrink: 0,
      }}
      aria-hidden="true"
    />
  );
}

export function ProfileHero({ user, onSendKudos }: ProfileHeroProps) {
  const initial = user.name.charAt(0).toUpperCase();
  const t = useTranslations("ProfileHero");

  return (
    <section style={{ position: "relative", overflow: "hidden" }}>
      {/* Keyvisual background — same crop as kudos hero */}
      <div
        style={{
          height: 320,
          background: `${KV_OVERLAY}, ${KV_BG}`,
        }}
        aria-hidden="true"
      />

      {/* Overlapping info panel — centered, pulled up over hero bottom */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          marginTop: -72,
          paddingBottom: 32,
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* A.1: Avatar */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            overflow: "hidden",
            border: "3px solid rgba(255,234,158,0.5)",
            background: "rgba(255,234,158,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {user.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatar} alt={user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span
              style={{
                fontFamily: FONT,
                fontSize: 32,
                fontWeight: 700,
                color: YELLOW,
              }}
            >
              {initial}
            </span>
          )}
        </div>

        {/* A.2: Name + department + hero badge */}
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 6 }}>
          <h1
            style={{
              fontFamily: FONT,
              fontSize: 24,
              fontWeight: 700,
              color: "#fff",
              margin: 0,
              lineHeight: "32px",
            }}
          >
            {user.name}
          </h1>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {user.department && (
              <span
                style={{
                  fontFamily: FONT,
                  fontSize: 13,
                  color: "rgba(255,255,255,0.55)",
                }}
              >
                {user.department}
              </span>
            )}
            {user.kudos_count > 0 && (
              <HeroBadgeChip kudosCount={user.kudos_count} tooltipPosition="bottom" />
            )}
          </div>
        </div>

        {/* A.3: Icon collection */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            marginTop: 8,
          }}
        >
          <span
            style={{
              fontFamily: FONT,
              fontSize: 12,
              fontWeight: 700,
              color: "rgba(255,255,255,0.45)",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            {t("iconCollection")}
          </span>
          <div style={{ display: "flex", gap: 10 }}>
            {BADGE_SLOTS.map(({ tier, threshold, label }) =>
              user.kudos_count >= threshold
                ? <IconSlot key={tier} tier={tier} label={label} />
                : <IconSlot key={tier} />
            )}
            {/* Two extra placeholder slots for future badges */}
            <IconSlot />
            <IconSlot />
          </div>
        </div>

        {onSendKudos && (
          <button
            type="button"
            onClick={onSendKudos}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(255,234,158,0.08)",
              border: "1px solid #998C5F",
              borderRadius: 999,
              padding: "12px 24px",
              fontFamily: FONT,
              fontSize: 14,
              fontWeight: 600,
              color: YELLOW,
              cursor: "pointer",
              maxWidth: 420,
              width: "100%",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke={YELLOW} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke={YELLOW} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {t("sendKudosTo", { name: user.name })}
            </span>
          </button>
        )}
      </div>
    </section>
  );
}
