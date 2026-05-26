"use client";

import { useState } from "react";
import type { KudosPost } from "@/lib/kudos/types";
import { KudosCard } from "./kudos-card";
import { KudosToast } from "./kudos-toast";

interface KudosCardServerProps {
  post: KudosPost;
  currentUserId: string;
  locale: string;
}

/**
 * Interactive wrapper for KudosCard used in the detail page.
 * Manages like state and copy-link toast locally — no router dependency needed.
 */
export function KudosCardServer({ post: initialPost, currentUserId, locale: _locale }: KudosCardServerProps) {
  const [post, setPost] = useState(initialPost);
  const [toast, setToast] = useState({ message: "", visible: false });

  function showToast(message: string) {
    setToast({ message, visible: true });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
  }

  async function handleLike() {
    const res = await fetch(`/api/kudos/${post.id}/like`, { method: "POST" });
    if (!res.ok) return;
    const { liked }: { liked: boolean } = await res.json();
    setPost((p) => ({
      ...p,
      liked_by_me: liked,
      like_count: p.like_count + (liked ? 1 : -1),
    }));
  }

  function handleCopyLink() {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => showToast("Đã copy link!"));
  }

  return (
    <>
      <KudosCard
        post={post}
        variant="feed"
        currentUserId={currentUserId}
        onLike={handleLike}
        onCopyLink={handleCopyLink}
      />
      <KudosToast message={toast.message} visible={toast.visible} />
    </>
  );
}
