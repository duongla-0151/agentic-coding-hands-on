"use client";

import { usePathname } from "next/navigation";
import type { KudosPost } from "@/lib/kudos/types";
import { KudosCardUser } from "./kudos-card-user";
import { CampaignBadge } from "./campaign-badge";

const FONT = "var(--font-montserrat), Montserrat, sans-serif";
const HIGHLIGHT_BG = "#FFF8E1";
const HIGHLIGHT_BORDER = "4px solid #FFEA9E";
const FEED_BG = "rgba(255,248,225,1)";
const FEED_BORDER = "1px solid rgba(153,140,95,0.2)";
const SEPARATOR = "1px solid #FFEA9E";
const CONTENT_BOX_BG = "rgba(255,234,158,0.4)";
const CONTENT_BOX_BORDER = "1px solid #FFEA9E";

interface KudosCardProps {
  post: KudosPost;
  variant: "highlight" | "feed";
  currentUserId: string;
  onLike: () => void;
  onCopyLink: () => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${hh}:${mm} - ${dd}/${mo}/${yyyy}`;
}

export function KudosCard({ post, variant, currentUserId, onLike, onCopyLink }: KudosCardProps) {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] ?? "vi";
  const isHighlight = variant === "highlight";
  const maxLines = isHighlight ? 3 : 5;
  const isSender = post.sender?.id === currentUserId;
  const isRecipient = post.recipient.id === currentUserId;
  const isParticipant = isSender || isRecipient;

  return (
    <div
      style={{
        background: isHighlight ? HIGHLIGHT_BG : FEED_BG,
        border: isHighlight ? HIGHLIGHT_BORDER : FEED_BORDER,
        borderRadius: isHighlight ? 16 : 24,
        padding: isHighlight ? "24px 24px 16px 24px" : "40px 40px 16px 40px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        height: isHighlight ? "100%" : undefined,
        boxSizing: "border-box",
      }}
    >
      {/* Sender → Recipient row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
        <KudosCardUser
          user={post.sender}
          anonymousName={post.anonymous_name}
          kudosCount={post.sender_kudos_count}
          badgeLabel={post.badge}
          size="md"
          light
          profileHref={post.sender && !post.anonymous_name ? `/${locale}/profile/${post.sender.id}` : undefined}
        />
        {/* Paper airplane / send icon — rotated 45° to point horizontally right */}
        <svg
          width="20" height="20" viewBox="0 0 24 24" fill="none"
          style={{ flexShrink: 0, color: "rgba(0,16,26,0.35)" }}
          aria-hidden="true"
        >
          <g transform="rotate(45, 12, 12)">
            <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
        </svg>
        <KudosCardUser
          user={post.recipient}
          anonymousName={null}
          kudosCount={post.recipient_kudos_count}
          badgeLabel={post.badge}
          size="md"
          light
          showHoverCard
          profileHref={`/${locale}/profile/${post.recipient.id}`}
        />
      </div>

      {/* Yellow separator after user row */}
      <div style={{ height: 1, background: SEPARATOR }} />

      {/* Timestamp */}
      <span
        style={{
          fontFamily: FONT,
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: "0.5px",
          color: "rgba(153,153,153,1)",
        }}
      >
        {formatDate(post.created_at)}
      </span>

      {/* Content — inside yellow-tinted box */}
      <div
        style={{
          background: CONTENT_BOX_BG,
          border: CONTENT_BOX_BORDER,
          borderRadius: 12,
          padding: "16px 24px",
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 20,
            fontWeight: 700,
            lineHeight: "32px",
            color: "rgba(0,16,26,1)",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: maxLines,
            WebkitBoxOrient: "vertical",
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      {/* Images */}
      {post.images.length > 0 && (
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {post.images.slice(0, 5).filter((s) => /^https?:\/\//i.test(s)).map((src) => (
            <a key={src} href={src} target="_blank" rel="noopener noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                style={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  borderRadius: 8,
                  border: "1px solid rgba(139,105,20,0.15)",
                }}
              />
            </a>
          ))}
        </div>
      )}

      {/* Hashtags — plain red text */}
      {post.hashtags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {post.hashtags.slice(0, 5).map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: FONT,
                fontSize: 12,
                fontWeight: 600,
                color: "#D32F2F",
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Yellow separator before action row */}
      <div style={{ height: 1, background: SEPARATOR }} />

      {/* Actions row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
        {/* Like */}
        <button
          type="button"
          onClick={onLike}
          disabled={isParticipant}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontFamily: FONT,
            fontSize: 13,
            color: post.liked_by_me ? "#fff" : "#7C52D9",
            background: post.liked_by_me ? "#7C52D9" : "rgba(124,82,217,0.08)",
            border: post.liked_by_me ? "none" : "1px solid rgba(124,82,217,0.3)",
            borderRadius: 999,
            padding: "4px 12px",
            cursor: isParticipant ? "not-allowed" : "pointer",
            opacity: isParticipant ? 0.35 : 1,
            flexShrink: 0,
          }}
          aria-label={post.liked_by_me ? "Bỏ thích" : "Thích"}
        >
          <span style={{ fontSize: 14 }}>♥</span>
          <span>{post.like_count}</span>
        </button>

        {/* Right side buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Campaign x2 badge — shown only during active campaign period */}
          <CampaignBadge tooltipPosition="top" />

          {/* Copy link */}
          <button
            type="button"
            onClick={onCopyLink}
            style={{
              fontFamily: FONT,
              fontSize: 12,
              color: "rgba(0,16,26,0.5)",
              background: "none",
              border: "1px solid rgba(0,16,26,0.2)",
              borderRadius: 999,
              padding: "4px 14px",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Copy Link
          </button>

          {/* Highlight only: Xem chi tiết */}
          {isHighlight && (
            <a
              href={`/${locale}/kudos/${post.id}`}
              style={{
                fontFamily: FONT,
                fontSize: 12,
                color: "#7C52D9",
                fontWeight: 600,
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              Xem chi tiết →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
