"use client";

import { useState, useEffect } from "react";
import { WriteKudoModal } from "@/components/homepage/write-kudo-modal";
import { KudosHero } from "./kudos-hero";
import { FilterBar } from "./filter-bar";
import { KudosHighlightSection } from "./kudos-highlight-section";
import { KudosSpotlightSection } from "./kudos-spotlight-section";
import { AllKudosFeed } from "./all-kudos-feed";
import { KudosSidebar } from "./kudos-sidebar";

const BG = "#00101A";
const FONT = "var(--font-montserrat), Montserrat, sans-serif";

interface KudosPageClientProps {
  locale: string;
  userId: string;
}

export function KudosPageClient({ locale: _locale, userId }: KudosPageClientProps) {
  const [hashtag, setHashtag] = useState<string | null>(null);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [kudosModalOpen, setKudosModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/kudos/hashtags")
      .then((r) => r.json())
      .then((data: string[]) => setHashtags(Array.isArray(data) ? data : []))
      .catch(() => {/* silent */});
  }, []);

  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: FONT }}>
      {/* Hero */}
      <KudosHero onWriteClick={() => setKudosModalOpen(true)} />

      {/* Filter bar */}
      <div style={{ paddingTop: 32 }}>
        <FilterBar
          hashtags={hashtags}
          selected={hashtag}
          onSelect={setHashtag}
        />
      </div>

      {/* Highlight Kudos */}
      <KudosHighlightSection hashtag={hashtag} currentUserId={userId} />

      {/* Spotlight Board */}
      <KudosSpotlightSection />

      {/* Two-column layout: Feed (70%) | Sidebar (30%) */}
      <div
        style={{
          display: "flex",
          gap: 32,
          padding: "48px 144px 80px",
          alignItems: "flex-start",
        }}
      >
        {/* All Kudos Feed — ~70% */}
        <div style={{ flex: "0 0 67%", minWidth: 0 }}>
          <AllKudosFeed hashtag={hashtag} currentUserId={userId} />
        </div>

        {/* Sidebar — ~30%, sticky */}
        <div
          style={{
            flex: "0 0 calc(33% - 32px)",
            minWidth: 0,
            position: "sticky",
            top: 96,
            alignSelf: "flex-start",
          }}
        >
          <KudosSidebar userId={userId} />
        </div>
      </div>

      {/* Write Kudos modal */}
      {kudosModalOpen && (
        <WriteKudoModal onClose={() => setKudosModalOpen(false)} />
      )}
    </div>
  );
}
