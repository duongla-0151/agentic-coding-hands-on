"use client";

import { useState, useRef, useLayoutEffect } from "react";
import type { KudosPost } from "@/lib/kudos/types";
import { KudosCard } from "./kudos-card";

const FONT = "var(--font-montserrat), Montserrat, sans-serif";
const CARD_WIDTH = 528; // fixed card width per design
const GAP = 24; // gap between cards per design

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
  const [containerWidth, setContainerWidth] = useState(0);

  useLayoutEffect(() => {
    function measure() {
      if (containerRef.current) setContainerWidth(containerRef.current.offsetWidth);
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

  // Center the active card within the viewport
  const offset = containerWidth > 0 ? (containerWidth - CARD_WIDTH) / 2 : 0;
  const translateX = offset - activeIndex * (CARD_WIDTH + GAP);

  return (
    <div style={{ position: "relative" }}>
      {/* Prev arrow */}
      <button
        type="button"
        onClick={prev}
        disabled={activeIndex === 0}
        style={{
          position: "absolute",
          left: 8,
          top: "50%",
          transform: "translateY(-60%)",
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: activeIndex === 0 ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.12)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: activeIndex === 0 ? "rgba(255,255,255,0.2)" : "#fff",
          fontSize: 22,
          cursor: activeIndex === 0 ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 3,
        }}
        aria-label="Trước"
      >
        ‹
      </button>

      {/* Viewport — clips the track */}
      <div ref={containerRef} style={{ overflow: "hidden" }}>
        {/* Track — slides left/right */}
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
                  flex: `0 0 ${CARD_WIDTH}px`,
                  width: CARD_WIDTH,
                  opacity: isActive ? 1 : 0.45,
                  transform: isActive ? "scale(1)" : "scale(0.97)",
                  transition: "opacity 0.35s ease, transform 0.35s ease",
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
          right: 8,
          top: "50%",
          transform: "translateY(-60%)",
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: activeIndex === total - 1 ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.12)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: activeIndex === total - 1 ? "rgba(255,255,255,0.2)" : "#fff",
          fontSize: 22,
          cursor: activeIndex === total - 1 ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 3,
        }}
        aria-label="Tiếp"
      >
        ›
      </button>

      {/* Pagination indicator */}
      <div
        style={{
          textAlign: "center",
          marginTop: 20,
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
