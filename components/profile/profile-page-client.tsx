"use client";

import { useState, useEffect } from "react";
import { ProfileHero } from "./profile-hero";
import { ProfileStats } from "./profile-stats";
import { ProfileKudosFeed } from "./profile-kudos-feed";

const FONT = "var(--font-montserrat), Montserrat, sans-serif";

interface Stats {
  received: number;
  sent: number;
  hearts: number;
  secret_boxes_opened: number;
  secret_boxes_available: number;
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
  const [statsError, setStatsError] = useState(false);

  useEffect(() => {
    fetch("/api/kudos/stats")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d: Stats) => setStats(d))
      .catch(() => setStatsError(true));
  }, []);

  const kudosCount = stats?.received ?? 0;
  const emptyStats = { received: 0, sent: 0, hearts: 0, secret_boxes_opened: 0, secret_boxes_available: 0 };

  return (
    <div style={{ background: "#00101A", minHeight: "100vh", fontFamily: FONT }}>
      <ProfileHero
        user={{ name: userName, avatar: userAvatar, department: userDepartment, kudos_count: kudosCount }}
      />

      {statsError ? (
        <p style={{ fontFamily: FONT, fontSize: 13, color: "rgba(255,255,255,0.4)", textAlign: "center", padding: "24px 0" }}>
          Không thể tải dữ liệu thống kê.
        </p>
      ) : (
        <ProfileStats
          stats={stats ?? emptyStats}
          onOpenSecretBox={() => alert("Secret Box — coming soon!")}
        />
      )}

      <ProfileKudosFeed
        currentUserId={userId}
        locale={locale}
        sentCount={stats?.sent ?? 0}
        receivedCount={stats?.received ?? 0}
      />
    </div>
  );
}
