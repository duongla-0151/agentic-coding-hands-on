"use client";

import { usePathname } from "next/navigation";
import type { KudosPost } from "@/lib/kudos/types";
import { KudosCardUser } from "./kudos-card-user";

const FONT = "var(--font-montserrat), Montserrat, sans-serif";
const CARD_BG = "rgba(255,255,255,0.04)";
const CARD_BORDER = "1px solid rgba(255,255,255,0.1)";
const YELLOW = "#FFEA9E";

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

  return (
    <div
      style={{
        background: CARD_BG,
        border: CARD_BORDER,
        borderRadius: 16,
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        height: isHighlight ? "100%" : undefined,
      }}
    >
      {/* Sender → Recipient row */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <KudosCardUser
          user={post.sender}
          anonymousName={post.anonymous_name}
          size="md"
        />
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 18, flexShrink: 0 }}>→</span>
        <KudosCardUser
          user={post.recipient}
          anonymousName={null}
          kudosCount={post.recipient_kudos_count}
          badge={post.badge}
          size="md"
        />
      </div>

      {/* Timestamp */}
      <span
        style={{
          fontFamily: FONT,
          fontSize: 11,
          color: "rgba(255,255,255,0.35)",
        }}
      >
        {formatDate(post.created_at)}
      </span>

      {/* Content */}
      <div
        style={{
          fontFamily: FONT,
          fontSize: 14,
          color: "rgba(255,255,255,0.85)",
          lineHeight: 1.6,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: maxLines,
          WebkitBoxOrient: "vertical",
        }}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Hashtags */}
      {post.hashtags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {post.hashtags.slice(0, 5).map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: FONT,
                fontSize: 12,
                color: YELLOW,
                background: "rgba(255,234,158,0.1)",
                border: "1px solid rgba(255,234,158,0.25)",
                borderRadius: 999,
                padding: "3px 10px",
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Images */}
      {post.images.length > 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {post.images.slice(0, 5).filter((s) => /^https?:\/\//i.test(s)).map((src) => (
            <a key={src} href={src} target="_blank" rel="noopener noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                style={{
                  width: 64,
                  height: 64,
                  objectFit: "cover",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              />
            </a>
          ))}
        </div>
      )}

      {/* Actions row */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 4 }}>
        {/* Like */}
        <button
          type="button"
          onClick={onLike}
          disabled={isSender}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontFamily: FONT,
            fontSize: 13,
            color: post.liked_by_me ? "#FF6B6B" : "rgba(255,255,255,0.5)",
            background: "none",
            border: "none",
            cursor: isSender ? "not-allowed" : "pointer",
            opacity: isSender ? 0.35 : 1,
            padding: 0,
          }}
          aria-label={post.liked_by_me ? "Bỏ thích" : "Thích"}
        >
          <span style={{ fontSize: 16 }}>{post.liked_by_me ? "❤️" : "🤍"}</span>
          <span>{post.like_count}</span>
        </button>

        {/* Copy link */}
        <button
          type="button"
          onClick={onCopyLink}
          style={{
            fontFamily: FONT,
            fontSize: 12,
            color: "rgba(255,255,255,0.45)",
            background: "none",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 999,
            padding: "3px 12px",
            cursor: "pointer",
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
              color: YELLOW,
              textDecoration: "none",
              marginLeft: "auto",
            }}
          >
            Xem chi tiết →
          </a>
        )}
      </div>
    </div>
  );
}
