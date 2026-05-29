"use client";

import { useState, useEffect, useCallback } from "react";
import type { KudosPost } from "@/lib/kudos/types";
import { KudosCard } from "@/components/kudos/kudos-card";
import { KudosToast } from "@/components/kudos/kudos-toast";

const FONT = "var(--font-montserrat), Montserrat, sans-serif";
const YELLOW = "#FFEA9E";
const SEPARATOR = "1px solid rgba(153,140,95,0.35)";

type FeedView = "sent" | "received";

interface ProfileKudosFeedProps {
  currentUserId: string;
  locale: string;
  /** Counts from stats API for toggle button labels */
  sentCount: number;
  receivedCount: number;
}

export function ProfileKudosFeed({ currentUserId, locale, sentCount, receivedCount }: ProfileKudosFeedProps) {
  const [view, setView] = useState<FeedView>("sent");
  const [sentPosts, setSentPosts] = useState<KudosPost[]>([]);
  const [receivedPosts, setReceivedPosts] = useState<KudosPost[]>([]);
  const [loadedSent, setLoadedSent] = useState(false);
  const [loadedReceived, setLoadedReceived] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", visible: false });

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
  }, []);

  const fetchPosts = useCallback(async (type: FeedView) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/profile/kudos?type=${type}`);
      const data: KudosPost[] = res.ok ? await res.json() : [];
      if (type === "sent") setSentPosts(data);
      else setReceivedPosts(data);
    } catch { /* silent */ }
    finally {
      // Always mark loaded so failed fetches don't trigger infinite retries on toggle
      if (type === "sent") setLoadedSent(true);
      else setLoadedReceived(true);
      setLoading(false);
    }
  }, []);

  // Load sent posts on mount
  useEffect(() => { fetchPosts("sent"); }, [fetchPosts]);

  function handleToggle() {
    const next: FeedView = view === "sent" ? "received" : "sent";
    setView(next);
    if (next === "received" && !loadedReceived) fetchPosts("received");
    if (next === "sent" && !loadedSent) fetchPosts("sent");
  }

  async function handleLike(id: string) {
    const res = await fetch(`/api/kudos/${id}/like`, { method: "POST" });
    if (!res.ok) return;
    const { liked }: { liked: boolean } = await res.json();
    const update = (posts: KudosPost[]) =>
      posts.map((p) => p.id === id
        ? { ...p, liked_by_me: liked, like_count: Math.max(0, p.like_count + (liked ? 1 : -1)) }
        : p);
    setSentPosts(update);
    setReceivedPosts(update);
  }

  function handleCopyLink(id: string) {
    const url = `${window.location.origin}/${locale}/kudos/${id}`;
    navigator.clipboard.writeText(url).then(() => showToast("Đã copy link!"));
  }

  const posts = view === "sent" ? sentPosts : receivedPosts;
  const toggleLabel = view === "sent" ? `Đã gửi (${sentCount})` : `Nhận được (${receivedCount})`;

  return (
    <section style={{ padding: "0 144px 80px" }}>
      {/* Section C: Awards header */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.55)", margin: "0 0 10px", letterSpacing: "1px", textTransform: "uppercase" }}>
          Sun* Annual Awards 2025
        </p>
        <div style={{ height: 1, background: SEPARATOR, marginBottom: 12 }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontFamily: FONT, fontSize: 40, fontWeight: 900, color: YELLOW, margin: 0, letterSpacing: "2px", textTransform: "uppercase" }}>
            KUDOS
          </h2>
          <button
            type="button"
            onClick={handleToggle}
            style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,234,158,0.08)", border: "1px solid #998C5F", borderRadius: 999, padding: "8px 18px", fontFamily: FONT, fontSize: 14, fontWeight: 700, color: YELLOW, cursor: "pointer", whiteSpace: "nowrap" }}
            aria-label="Chuyển đổi view"
          >
            {toggleLabel}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M7 10l5 5 5-5" stroke={YELLOW} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Section D: Kudos feed */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", gap: 6, padding: "48px 0" }}>
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,0.4)", display: "inline-block", animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <p style={{ fontFamily: FONT, fontSize: 14, color: "rgba(255,255,255,0.4)", textAlign: "center", padding: "48px 0" }}>
          Chưa có Kudos nào.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {posts.map((post) => (
            <KudosCard key={post.id} post={post} variant="feed" currentUserId={currentUserId}
              onLike={() => handleLike(post.id)} onCopyLink={() => handleCopyLink(post.id)} />
          ))}
        </div>
      )}

      <KudosToast message={toast.message} visible={toast.visible} />
      <style>{`@keyframes pulse { 0%,80%,100%{opacity:.3;transform:scale(.8)} 40%{opacity:1;transform:scale(1)} }`}</style>
    </section>
  );
}
