import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getIsAdmin } from "@/lib/supabase/get-is-admin";
import { fetchUserMap } from "@/lib/kudos/fetch-users";
import { enrichKudos, buildLikeMaps, buildRecipientCountMap } from "@/lib/kudos/enrich-kudos";
import { SiteHeader } from "@/components/homepage/site-header";
import { SiteFooter } from "@/components/homepage/site-footer";
import { KudosCardServer } from "@/components/kudos/kudos-card-server";

const FONT = "var(--font-montserrat), Montserrat, sans-serif";

export default async function KudosDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const [isAdmin, { data: row, error }] = await Promise.all([
    getIsAdmin(user.id),
    supabase.from("kudos").select("*").eq("id", id).maybeSingle(),
  ]);

  if (error || !row) {
    notFound();
  }

  const senderId = row.sender_id ?? null;

  const [{ data: likes }, { data: recipRows }, { data: senderRows }, userMap] = await Promise.all([
    supabase.from("kudos_likes").select("kudos_id, user_id").eq("kudos_id", id),
    supabase.from("kudos").select("recipient_id").eq("recipient_id", row.recipient_id),
    senderId
      ? supabase.from("kudos").select("recipient_id").eq("recipient_id", senderId)
      : Promise.resolve({ data: [] }),
    fetchUserMap(),
  ]);

  const { likeCountMap, likedByMe } = buildLikeMaps(likes ?? [], user.id);
  const recipientCountMap = buildRecipientCountMap(recipRows ?? []);
  const senderCountMap = buildRecipientCountMap(senderRows ?? []);
  const post = enrichKudos(row, { userMap, likeCountMap, likedByMe, recipientCountMap, senderCountMap });

  return (
    <div style={{ background: "#00101A", minHeight: "100vh" }}>
      <SiteHeader locale={locale} isAdmin={isAdmin} />
      <main
        style={{
          paddingTop: 80,
          maxWidth: 720,
          margin: "0 auto",
          padding: "96px 24px 80px",
        }}
      >
        <a
          href={`/${locale}/kudos`}
          style={{
            fontFamily: FONT,
            fontSize: 14,
            color: "rgba(255,255,255,0.55)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 32,
          }}
        >
          ← Quay lại
        </a>

        <KudosCardServer post={post} currentUserId={user.id} locale={locale} />
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
