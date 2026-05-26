"use client";

import { useState, useEffect, useCallback } from "react";
import type { KudosPost } from "@/lib/kudos/types";
import { HighlightCarousel } from "./highlight-carousel";
import { KudosToast } from "./kudos-toast";

const FONT = "var(--font-montserrat), Montserrat, sans-serif";

interface KudosHighlightSectionProps {
  hashtag: string | null;
  currentUserId: string;
}

export function KudosHighlightSection({ hashtag, currentUserId }: KudosHighlightSectionProps) {
  const [posts, setPosts] = useState<KudosPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", visible: false });

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (hashtag) params.set("hashtag", hashtag);
    fetch(`/api/kudos/highlights?${params.toString()}`)
      .then((r) => r.json())
      .then((data: KudosPost[]) => setPosts(Array.isArray(data) ? data : []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [hashtag]);

  async function handleLike(id: string) {
    const res = await fetch(`/api/kudos/${id}/like`, { method: "POST" });
    if (!res.ok) return;
    const { liked }: { liked: boolean } = await res.json();
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, liked_by_me: liked, like_count: p.like_count + (liked ? 1 : -1) }
          : p
      )
    );
  }

  function handleCopyLink(id: string) {
    const url = `${window.location.origin}${window.location.pathname.split("/kudos")[0]}/kudos/${id}`;
    navigator.clipboard.writeText(url).then(() => showToast("Đã copy link!"));
  }

  return (
    <section style={{ padding: "0 144px", marginBottom: 48 }}>
      {/* Section header */}
      <div style={{ marginBottom: 32 }}>
        <p
          style={{
            fontFamily: FONT,
            fontSize: 13,
            fontWeight: 600,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            margin: "0 0 4px 0",
          }}
        >
          Sun* Annual Awards 2025
        </p>
        <h2
          style={{
            fontFamily: FONT,
            fontSize: 28,
            fontWeight: 900,
            color: "#fff",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          HIGHLIGHT KUDOS
        </h2>
      </div>

      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 6,
            padding: "48px 0",
          }}
          aria-label="Đang tải..."
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.4)",
                display: "inline-block",
                animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      ) : (
        <HighlightCarousel
          posts={posts}
          currentUserId={currentUserId}
          onLike={handleLike}
          onCopyLink={handleCopyLink}
        />
      )}

      <KudosToast message={toast.message} visible={toast.visible} />

      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </section>
  );
}
