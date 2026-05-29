"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import type { KudosPost } from "@/lib/kudos/types";
import { KudosCard } from "@/components/kudos/kudos-card";
import { KudosToast } from "@/components/kudos/kudos-toast";

const FONT = "var(--font-montserrat), Montserrat, sans-serif";
const YELLOW = "#FFEA9E";
const SEPARATOR = "1px solid rgba(153,140,95,0.35)";

interface OtherProfileKudosFeedProps {
  targetUserId: string;
  currentUserId: string;
  locale: string;
  receivedCount: number;
}

export function OtherProfileKudosFeed({
  targetUserId,
  currentUserId,
  locale,
  receivedCount,
}: OtherProfileKudosFeedProps) {
  const [posts, setPosts] = useState<KudosPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: "", visible: false });
  const t = useTranslations("OtherProfileFeed");

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/users/${targetUserId}/kudos`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data: KudosPost[]) => setPosts(data))
      .catch(() => {/* silent */})
      .finally(() => setLoading(false));
  }, [targetUserId]);

  async function handleLike(id: string) {
    const res = await fetch(`/api/kudos/${id}/like`, { method: "POST" });
    if (!res.ok) return;
    const { liked }: { liked: boolean } = await res.json();
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, liked_by_me: liked, like_count: Math.max(0, p.like_count + (liked ? 1 : -1)) }
          : p
      )
    );
  }

  function handleCopyLink(id: string) {
    const url = `${window.location.origin}/${locale}/kudos/${id}`;
    navigator.clipboard.writeText(url).then(() => showToast(t("linkCopied")));
  }

  return (
    <section>
      {/* Section header */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.55)", margin: "0 0 10px", letterSpacing: "1px", textTransform: "uppercase" }}>
          Sun* Annual Awards 2025
        </p>
        <div style={{ height: 1, background: SEPARATOR, marginBottom: 12 }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontFamily: FONT, fontSize: 40, fontWeight: 900, color: YELLOW, margin: 0, letterSpacing: "2px", textTransform: "uppercase" }}>
            KUDOS
          </h2>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255,234,158,0.08)",
              border: "1px solid #998C5F",
              borderRadius: 999,
              padding: "8px 18px",
              fontFamily: FONT,
              fontSize: 14,
              fontWeight: 700,
              color: YELLOW,
              whiteSpace: "nowrap",
            }}
          >
            {t("receivedCount", { count: receivedCount })}
          </span>
        </div>
      </div>

      {/* Feed */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", gap: 6, padding: "48px 0" }}>
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
      ) : posts.length === 0 ? (
        <p style={{ fontFamily: FONT, fontSize: 14, color: "rgba(255,255,255,0.4)", textAlign: "center", padding: "48px 0" }}>
          {t("empty")}
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {posts.map((post) => (
            <KudosCard
              key={post.id}
              post={post}
              variant="feed"
              currentUserId={currentUserId}
              onLike={() => handleLike(post.id)}
              onCopyLink={() => handleCopyLink(post.id)}
            />
          ))}
        </div>
      )}

      <KudosToast message={toast.message} visible={toast.visible} />
      <style>{`@keyframes pulse { 0%,80%,100%{opacity:.3;transform:scale(.8)} 40%{opacity:1;transform:scale(1)} }`}</style>
    </section>
  );
}
