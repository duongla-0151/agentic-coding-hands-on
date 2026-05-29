import { getTranslations } from "next-intl/server";
import { AwardCard } from "./award-card";

const MONTSERRAT = "var(--font-montserrat), Montserrat, sans-serif";

interface AwardsSectionProps {
  locale: string;
}

export async function AwardsSection({ locale }: AwardsSectionProps) {
  const t = await getTranslations("Awards");

  const AWARDS = [
    {
      title: "Top Talent",
      slug: "top-talent",
      badgeLabel: "TOP TALENT",
      description: t("topTalentDesc"),
    },
    {
      title: "Top Project",
      slug: "top-project",
      badgeLabel: "TOP PROJECT",
      description: t("topProjectDesc"),
    },
    {
      title: "Top Project Leader",
      slug: "top-project-leader",
      badgeLabel: "TOP PROJECT LEADER",
      description: t("topProjectLeaderDesc"),
    },
    {
      title: "Best Manager",
      slug: "best-manager",
      badgeLabel: "BEST MANAGER",
      description: t("bestManagerDesc"),
    },
    {
      title: "Signature 2025 - Creator",
      slug: "signature-2025-creator",
      badgeLabel: "SIGNATURE 2025 CREATOR",
      description: t("signature2025Desc"),
    },
    {
      title: "MVP (Most Valuable Person)",
      slug: "mvp",
      badgeLabel: "MVP",
      description: t("mvpDesc"),
    },
  ];

  return (
    <section
      id="awards"
      className="w-full"
      style={{ background: "#00101A", padding: "80px 144px" }}
    >
      {/* Section heading */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          marginBottom: 80,
        }}
      >
        <p
          style={{
            fontFamily: MONTSERRAT,
            fontSize: 24,
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: "32px",
            margin: 0,
          }}
        >
          Sun* annual awards 2025
        </p>
        <div style={{ height: 1, background: "#2E3940" }} />
        <h2
          style={{
            fontFamily: MONTSERRAT,
            fontSize: 57,
            fontWeight: 700,
            color: "#FFEA9E",
            lineHeight: "64px",
            letterSpacing: "-0.25px",
            margin: 0,
          }}
        >
          {t("sectionTitle")}
        </h2>
      </div>

      {/* Awards grid */}
      <div
        className="grid"
        style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: "80px" }}
      >
        {AWARDS.map((award) => (
          <AwardCard
            key={award.slug}
            title={award.title}
            description={award.description}
            slug={award.slug}
            locale={locale}
            badgeLabel={award.badgeLabel}
          />
        ))}
      </div>
    </section>
  );
}
