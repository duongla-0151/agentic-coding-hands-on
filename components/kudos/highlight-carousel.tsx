"use client";

import { useState } from "react";
import type { KudosPost } from "@/lib/kudos/types";
import { KudosCard } from "./kudos-card";

const FONT = "var(--font-montserrat), Montserrat, sans-serif";

interface HighlightCarouselProps {
  posts: KudosPost[];
  currentUserId: string;
  onLike: (id: string) => void;
  onCopyLink: (id: string) => void;
}

export function HighlightCarousel({
  posts,
  currentUserId,
  onLike,
  onCopyLink,
}: HighlightCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (posts.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "48px 0",
          fontFamily: FONT,
          fontSize: 14,
          color: "rgba(255,255,255,0.4)",
        }}
      >
        Hiện tại chưa có Kudos nào.
      </div>
    );
  }

  const total = posts.length;
  const prev = () => setActiveIndex((i) => Math.max(0, i - 1));
  const next = () => setActiveIndex((i) => Math.min(total - 1, i + 1));

  // Show up to 5 cards: active center ± 2 sides
  const visibleCount = Math.min(total, 5);
  // Compute which posts are visible: up to 2 before active, up to 2 after
  const start = Math.max(0, Math.min(activeIndex - 2, total - visibleCount));
  const visible = posts.slice(start, start + visibleCount);

  return (
    <div style={{ position: "relative", padding: "0 64px" }}>
      {/* Prev arrow */}
      <button
        type="button"
        onClick={prev}
        disabled={activeIndex === 0}
        style={{
          position: "absolute",
          left: 0,
          top: "50%",
          transform: "translateY(-50%)",
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: activeIndex === 0 ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.15)",
          color: activeIndex === 0 ? "rgba(255,255,255,0.2)" : "#fff",
          fontSize: 20,
          cursor: activeIndex === 0 ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
        }}
        aria-label="Trước"
      >
        ‹
      </button>

      {/* Cards */}
      <div
        style={{
          display: "flex",
          gap: 16,
          alignItems: "stretch",
          overflow: "hidden",
        }}
      >
        {visible.map((post, i) => {
          const absoluteIndex = start + i;
          const isActive = absoluteIndex === activeIndex;
          return (
            <div
              key={post.id}
              onClick={() => setActiveIndex(absoluteIndex)}
              style={{
                flex: isActive ? "0 0 38%" : "0 0 18%",
                opacity: isActive ? 1 : 0.6,
                transition: "flex 0.3s ease, opacity 0.3s ease",
                cursor: isActive ? "default" : "pointer",
                minWidth: 0,
              }}
            >
              <KudosCard
                post={post}
                variant="highlight"
                currentUserId={currentUserId}
                onLike={() => onLike(post.id)}
                onCopyLink={() => onCopyLink(post.id)}
              />
            </div>
          );
        })}
      </div>

      {/* Next arrow */}
      <button
        type="button"
        onClick={next}
        disabled={activeIndex === total - 1}
        style={{
          position: "absolute",
          right: 0,
          top: "50%",
          transform: "translateY(-50%)",
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: activeIndex === total - 1 ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.15)",
          color: activeIndex === total - 1 ? "rgba(255,255,255,0.2)" : "#fff",
          fontSize: 20,
          cursor: activeIndex === total - 1 ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
        }}
        aria-label="Tiếp"
      >
        ›
      </button>

      {/* Pagination indicator */}
      <div
        style={{
          textAlign: "center",
          marginTop: 16,
          fontFamily: FONT,
          fontSize: 13,
          color: "rgba(255,255,255,0.5)",
        }}
      >
        {activeIndex + 1}/{total}
      </div>
    </div>
  );
}
