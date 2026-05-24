import { AwardCard } from "./award-card";

const AWARDS = [
  {
    title: "Top Talent",
    slug: "top-talent",
    badgeLabel: "TOP TALENT",
    description: "Vinh danh những cá nhân xuất sắc với năng lực vượt trội và đóng góp nổi bật cho tổ chức.",
  },
  {
    title: "Top Project",
    slug: "top-project",
    badgeLabel: "TOP PROJECT",
    description: "Ghi nhận những dự án tiêu biểu mang lại giá trị cao và được thực thi xuất sắc.",
  },
  {
    title: "Top Project Leader",
    slug: "top-project-leader",
    badgeLabel: "TOP PROJECT LEADER",
    description: "Tôn vinh những Project Leader dẫn dắt đội nhóm đạt được kết quả vượt trội.",
  },
  {
    title: "Best Manager",
    slug: "best-manager",
    badgeLabel: "BEST MANAGER",
    description: "Vinh danh những nhà quản lý truyền cảm hứng, phát triển con người và tạo môi trường làm việc tốt nhất.",
  },
  {
    title: "Signature 2025 - Creator",
    slug: "signature-2025-creator",
    badgeLabel: "SIGNATURE 2025 CREATOR",
    description: "Dành cho những cá nhân sáng tạo, tạo ra dấu ấn đặc biệt và mang lại làn gió mới cho Sun*.",
  },
  {
    title: "MVP (Most Valuable Person)",
    slug: "mvp",
    badgeLabel: "MVP",
    description: "Phần thưởng cao quý nhất dành cho cá nhân có đóng góp toàn diện và tác động lớn nhất trong năm.",
  },
];

const MONTSERRAT = "var(--font-montserrat), Montserrat, sans-serif";

interface AwardsSectionProps {
  locale: string;
}

export function AwardsSection({ locale }: AwardsSectionProps) {
  return (
    <section
      id="awards"
      className="w-full"
      style={{ background: "#00101A", padding: "80px 144px" }}
    >
      {/* Section heading — C1: caption → divider → title, gap 16px each, 80px below */}
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
          Hệ thống giải thưởng
        </h2>
      </div>

      {/* Awards grid — 3 cols, gap 80px, 2 rows */}
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
