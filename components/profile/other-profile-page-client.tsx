"use client";

import { useRouter } from "next/navigation";
import { ProfileHero } from "./profile-hero";
import { OtherProfileKudosFeed } from "./other-profile-kudos-feed";
import { KudosSidebar } from "@/components/kudos/kudos-sidebar";

const FONT = "var(--font-montserrat), Montserrat, sans-serif";

interface OtherProfilePageClientProps {
  targetUserId: string;
  targetUserName: string;
  targetUserAvatar: string | null;
  targetUserDepartment: string | null;
  currentUserId: string;
  locale: string;
  receivedCount: number;
}

export function OtherProfilePageClient({
  targetUserId,
  targetUserName,
  targetUserAvatar,
  targetUserDepartment,
  currentUserId,
  locale,
  receivedCount,
}: OtherProfilePageClientProps) {
  const router = useRouter();

  function handleSendKudos() {
    router.push(`/${locale}/kudos`);
  }

  return (
    <div style={{ background: "#00101A", minHeight: "100vh", fontFamily: FONT }}>
      <ProfileHero
        user={{
          name: targetUserName,
          avatar: targetUserAvatar,
          department: targetUserDepartment,
          kudos_count: receivedCount,
        }}
        onSendKudos={handleSendKudos}
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
          <OtherProfileKudosFeed
            targetUserId={targetUserId}
            currentUserId={currentUserId}
            locale={locale}
            receivedCount={receivedCount}
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
          <KudosSidebar userId={targetUserId} />
        </div>
      </div>
    </div>
  );
}
