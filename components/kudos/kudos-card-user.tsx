"use client";

import { starCount } from "@/lib/kudos/fetch-users";
import type { UserInfo } from "@/lib/kudos/types";

const FONT = "var(--font-montserrat), Montserrat, sans-serif";
const YELLOW = "#FFEA9E";

interface KudosCardUserProps {
  user: UserInfo | null;
  anonymousName: string | null;
  /** kudos received by this user — only relevant for recipient */
  kudosCount?: number;
  badge?: string;
  size?: "sm" | "md";
  /** when true, render for light (cream) card background */
  light?: boolean;
}

export function KudosCardUser({
  user,
  anonymousName,
  kudosCount,
  badge,
  size = "md",
  light = false,
}: KudosCardUserProps) {
  const avatarSize = size === "sm" ? 32 : 40;
  const name = user?.name ?? anonymousName ?? "Ẩn danh";
  const initial = name.charAt(0).toUpperCase();
  const stars = kudosCount !== undefined ? starCount(kudosCount) : 0;
  const nameColor = light ? "rgba(0,16,26,0.9)" : "#fff";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
      {/* Avatar */}
      <div
        style={{
          width: avatarSize,
          height: avatarSize,
          borderRadius: "50%",
          overflow: "hidden",
          flexShrink: 0,
          background: light ? "rgba(139,105,20,0.15)" : "rgba(255,234,158,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: avatarSize * 0.4,
          color: light ? "#8B6914" : YELLOW,
          fontFamily: FONT,
          fontWeight: 700,
        }}
      >
        {user?.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.avatar}
            alt={name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          initial
        )}
      </div>

      {/* Name + stars, then badge on its own line */}
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span
            style={{
              fontFamily: FONT,
              fontSize: size === "sm" ? 12 : 14,
              fontWeight: 700,
              color: nameColor,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: 140,
            }}
          >
            {name}
          </span>
          {stars > 0 && (
            <span style={{ color: YELLOW, fontSize: size === "sm" ? 10 : 12, lineHeight: 1, flexShrink: 0 }}>
              {"★".repeat(stars)}
            </span>
          )}
        </div>
        {badge && (
          <span
            style={{
              display: "inline-block",
              marginTop: 3,
              fontFamily: FONT,
              fontSize: 11,
              fontWeight: 700,
              color: "#00101A",
              background: YELLOW,
              borderRadius: 999,
              padding: "2px 10px",
              whiteSpace: "nowrap",
              maxWidth: 180,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}
