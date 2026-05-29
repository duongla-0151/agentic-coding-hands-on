"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { KudosPost } from "@/lib/kudos/types";
import { KudosCard } from "./kudos-card";
import { KudosToast } from "./kudos-toast";

const FONT = "var(--font-montserrat), Montserrat, sans-serif";

interface AllKudosFeedProps {
  hashtag: string | null;
  department?: string | null;
  currentUserId: string;
}

export function AllKudosFeed({ hashtag, department = null, currentUserId }: AllKudosFeedProps) {
  const [posts, setPosts] = useState<KudosPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [toast, setToast] = useState({ message: "", visible: false });
  const sentinelRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
  }, []);

  const fetchPage = useCallback(async (cursor: string | null, tag: string | null, dept: string | null) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (tag) params.set("hashtag", tag);
      if (dept) params.set("department", dept);
      if (cursor) params.set("cursor", cursor);
      const res = await fetch(`/api/kudos?${params.toString()}`);
      if (!res.ok) throw new Error("fetch failed");
      const data: KudosPost[] = await res.json();
      setPosts((prev) => (cursor ? [...prev, ...data] : data));
      cursorRef.current = data.length > 0 ? data[data.length - 1].created_at : null;
      setHasMore(data.length >= 20);
    } catch {
      // silent — keep existing posts visible
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset + fetch on filter change
  useEffect(() => {
    cursorRef.current = null;
    setPosts([]);
    setHasMore(true);
    fetchPage(null, hashtag, department);
  }, [hashtag, department, fetchPage]);

  // Infinite scroll observer
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !loading) {
          fetchPage(cursorRef.current, hashtag, department);
        }
      },
      { rootMargin: "200px" }
    );
    if (sentinelRef.current) observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current?.disconnect();
  }, [hasMore, loading, hashtag, department, fetchPage]);

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
    const url = `${window.location.origin}${window.location.pathname.split("/kudos")[0]}/kudos/${id}`;
    navigator.clipboard.writeText(url).then(() => showToast("Đã copy link!"));
  }

  return (
    <div>
      {/* Section header */}
      <div style={{ marginBottom: 24 }}>
        <p
          style={{
            fontFamily: FONT,
            fontSize: 24,
            fontWeight: 700,
            color: "#fff",
            margin: "0 0 4px 0",
          }}
        >
          Sun* Annual Awards 2025
        </p>
        <div style={{ height: 1, background: "rgba(46,57,64,1)", margin: "4px 0 8px" }} />
        <h2
          style={{
            fontFamily: FONT,
            fontSize: 57,
            fontWeight: 700,
            color: "#FFEA9E",
            letterSpacing: "-0.25px",
            textTransform: "uppercase",
            margin: 0,
            lineHeight: "64px",
          }}
        >
          ALL KUDOS
        </h2>
      </div>

      {/* Feed */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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

      {/* Empty state */}
      {!loading && posts.length === 0 && (
        <p
          style={{
            fontFamily: FONT,
            fontSize: 14,
            color: "rgba(255,255,255,0.4)",
            textAlign: "center",
            padding: "48px 0",
          }}
        >
          Hiện tại chưa có Kudos nào.
        </p>
      )}

      {/* Loading spinner */}
      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 6,
            padding: "32px 0",
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
      )}

      {/* Sentinel for infinite scroll */}
      <div ref={sentinelRef} style={{ height: 1 }} aria-hidden="true" />

      <KudosToast message={toast.message} visible={toast.visible} />

      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
