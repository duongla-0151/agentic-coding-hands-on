"use client";

import { useState, useRef, useLayoutEffect } from "react";
import type { KudosPost } from "@/lib/kudos/types";
import { KudosCard } from "./kudos-card";

const FONT = "var(--font-montserrat), Montserrat, sans-serif";
const GAP = 16; // px between cards
const VISIBLE = 3; // cards visible at once (center + 1 each side)

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(0);

  // Measure container width to compute equal card widths
  useLayoutEffect(() => {
    function measure() {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        setCardWidth(Math.floor((w - GAP * (VISIBLE - 1)) / VISIBLE));
      }
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

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

  // Offset so activeIndex card is always centered in the 3-card window
  // Center slot index = 1 (0-based), so translate = -(activeIndex - 1) * (cardWidth + GAP)
  const centerSlot = Math.floor(VISIBLE / 2); // = 1
  const translateX = cardWidth > 0 ? -(activeIndex - centerSlot) * (cardWidth + GAP) : 0;

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

      {/* Viewport — clips the track */}
      <div ref={containerRef} style={{ overflow: "hidden" }}>
        {/* Track — slides left/right via translateX */}
        <div
          style={{
            display: "flex",
            gap: GAP,
            alignItems: "stretch",
            transform: `translateX(${translateX}px)`,
            transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
            willChange: "transform",
          }}
        >
          {posts.map((post, i) => {
            const isActive = i === activeIndex;
            return (
              <div
                key={post.id}
                onClick={() => setActiveIndex(i)}
                style={{
                  flex: `0 0 ${cardWidth}px`,
                  width: cardWidth,
                  opacity: isActive ? 1 : 0.5,
                  transition: "opacity 0.35s ease",
                  cursor: isActive ? "default" : "pointer",
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

      {/* Pagination */}
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
