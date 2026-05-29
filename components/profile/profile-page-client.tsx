"use client";

import { useState, useEffect } from "react";
import { ProfileHero } from "./profile-hero";
import { ProfileKudosFeed } from "./profile-kudos-feed";
import { KudosSidebar } from "@/components/kudos/kudos-sidebar";

const FONT = "var(--font-montserrat), Montserrat, sans-serif";

interface Stats {
  received: number;
  sent: number;
}

interface ProfilePageClientProps {
  userId: string;
  userName: string;
  userAvatar: string | null;
  userDepartment: string | null;
  locale: string;
}

export function ProfilePageClient({ userId, userName, userAvatar, userDepartment, locale }: ProfilePageClientProps) {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/kudos/stats")
      .then((r) => r.ok ? r.json() : null)
      .then((d: Stats | null) => { if (d) setStats(d); })
      .catch(() => {/* silent */});
  }, []);

  const kudosCount = stats?.received ?? 0;

  return (
    <div style={{ background: "#00101A", minHeight: "100vh", fontFamily: FONT }}>
      <ProfileHero
        user={{ name: userName, avatar: userAvatar, department: userDepartment, kudos_count: kudosCount }}
      />

      {/* Two-column layout: Feed (67%) | Sidebar (33%) */}
      <div
        style={{
          display: "flex",
          gap: 32,
          padding: "48px 144px 80px",
          alignItems: "flex-start",
        }}
      >
        <div style={{ flex: "0 0 67%", minWidth: 0 }}>
          <ProfileKudosFeed
            currentUserId={userId}
            locale={locale}
            sentCount={stats?.sent ?? 0}
            receivedCount={stats?.received ?? 0}
          />
        </div>

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
    </div>
  );
}
