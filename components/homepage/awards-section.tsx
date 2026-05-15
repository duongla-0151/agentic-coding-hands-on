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
      {/* Section heading */}
      <div className="mb-10">
        <p
          className="text-white/50 uppercase tracking-widest mb-2"
          style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: "12px",
            fontWeight: 700,
          }}
        >
          Sun* annual awards 2025
        </p>
        <h2
          className="text-white font-black"
          style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: "clamp(28px, 3vw, 40px)",
            fontWeight: 900,
          }}
        >
          Hệ thống giải thưởng
        </h2>
      </div>

      {/* Awards grid — 3 cols desktop, 2 cols tablet, 1 col mobile */}
      <div
        className="grid gap-6"
        style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
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
