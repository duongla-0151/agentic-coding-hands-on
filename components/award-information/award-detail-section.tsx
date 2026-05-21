"use client";

import { useState } from "react";
import { AwardDetailCard } from "./award-detail-card";

const AWARDS = [
  {
    id: "top-talent",
    title: "Top Talent",
    badgeLabel: "TOP TALENT",
    navLabel: "Top Talent",
    description:
      "Giải thưởng Top Talent vinh danh những cá nhân xuất sắc toàn diện — những người không ngừng học hỏi, không ngừng đóng góp. Đây là sự ghi nhận dành cho tài năng có năng lực vượt trội, tư duy sắc bén và đóng góp nổi bật cho tổ chức.",
    count: "10",
    unit: "Đơn vị",
    value: "7.000.000 VNĐ",
    valueNote: "cho mỗi giải thưởng",
  },
  {
    id: "top-project",
    title: "Top Project",
    badgeLabel: "TOP PROJECT",
    navLabel: "Top Project",
    description:
      "Giải thưởng Top Project vinh danh các tập thể đã hoàn thành dự án xuất sắc, mang lại giá trị lớn cho khách hàng và tổ chức. Các dự án được vinh danh là minh chứng rõ nét cho tinh thần hợp tác, kỹ thuật và chất lượng của đội ngũ Sun*.",
    count: "02",
    unit: "Tập thể",
    value: "15.000.000 VNĐ",
    valueNote: "cho mỗi giải thưởng",
  },
  {
    id: "top-project-leader",
    title: "Top Project Leader",
    badgeLabel: "TOP PROJECT LEADER",
    navLabel: "Top Project Leader",
    description:
      "Giải thưởng Top Project Leader vinh danh những cá nhân có khả năng dẫn dắt vượt trội, giúp đội nhóm đạt được kết quả xuất sắc. Đây là sự ghi nhận cho những người đã tạo ra môi trường làm việc tích cực, hướng đến mục tiêu chung và thành công bền vững.",
    count: "03",
    unit: "Cá nhân",
    value: "7.000.000 VNĐ",
    valueNote: "cho mỗi giải thưởng",
  },
  {
    id: "best-manager",
    title: "Best Manager",
    badgeLabel: "BEST MANAGER",
    navLabel: "Best Manager",
    description:
      "Giải thưởng Best Manager vinh danh những nhà quản lý truyền cảm hứng, phát triển con người và xây dựng đội ngũ gắn kết. Người được vinh danh là tấm gương về lãnh đạo tận tâm, luôn đồng hành cùng nhân viên và tổ chức trong mọi thử thách.",
    count: "01",
    unit: "Cá nhân",
    value: "10.000.000 VNĐ",
    valueNote: "cho mỗi giải thưởng",
  },
  {
    id: "signature-2025-creator",
    title: "Signature 2025 - Creator",
    badgeLabel: "SIGNATURE 2025 CREATOR",
    navLabel: "Signature 2025 - Creator",
    description:
      "Giải thưởng Signature 2025 - Creator vinh danh những cá nhân sáng tạo, tạo ra dấu ấn đặc biệt và mang lại làn gió mới cho Sun*. Đây là sự ghi nhận dành cho những người luôn tiên phong trong việc tạo ra những giá trị mới cho cộng đồng Sun*.",
    count: "01",
    unit: "",
    value: "5.000.000 VNĐ",
    valueNote: "cho cá nhân",
    value2: "8.000.000 VNĐ",
    value2Note: "cho tập thể",
  },
  {
    id: "mvp",
    title: "MVP (Most Valuable Person)",
    badgeLabel: "MVP",
    navLabel: "MVP",
    description:
      "Giải thưởng MVP là phần thưởng cao quý nhất dành cho cá nhân có đóng góp toàn diện và tác động lớn nhất trong năm. Người được vinh danh không chỉ xuất sắc về chuyên môn mà còn là biểu tượng của tinh thần Sun* — kiên định, sáng tạo và luôn hướng đến điều tốt nhất.",
    count: "01",
    unit: "",
    value: "15.000.000 VNĐ",
    valueNote: "cho mỗi giải thưởng",
  },
];

export function AwardDetailSection() {
  const [activeId, setActiveId] = useState(AWARDS[0].id);

  function handleNavClick(id: string) {
    setActiveId(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className="w-full" style={{ background: "#00101A", padding: "80px 144px" }}>
      {/* Section title */}
      <div className="mb-12">
        <p
          className="uppercase tracking-widest mb-2"
          style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: "12px",
            fontWeight: 700,
            color: "rgba(255,255,255,0.4)",
          }}
        >
          Sun* annual awards 2025
        </p>
        <h2
          className="font-black"
          style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: "clamp(28px, 3vw, 42px)",
            fontWeight: 900,
            color: "#FFEA9E",
          }}
        >
          Hệ thống giải thưởng SAA 2025
        </h2>
      </div>

      {/* Two-column: sticky nav + award cards */}
      <div className="flex gap-10 items-start">
        {/* Sticky left nav */}
        <nav
          aria-label="Award categories"
          className="flex flex-col gap-1 shrink-0"
          style={{ width: 200, position: "sticky", top: 100 }}
        >
          {AWARDS.map((award) => {
            const isActive = activeId === award.id;
            return (
              <button
                key={award.id}
                onClick={() => handleNavClick(award.id)}
                className="text-left transition-colors"
                style={{
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                  fontSize: "13px",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#FFEA9E" : "rgba(255,255,255,0.5)",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  background: isActive ? "rgba(255,234,158,0.08)" : "transparent",
                  borderBottom: isActive ? "2px solid #FFEA9E" : "2px solid transparent",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                }}
              >
                {award.navLabel}
              </button>
            );
          })}
        </nav>

        {/* Award cards */}
        <div className="flex flex-col gap-6" style={{ flex: 1, minWidth: 0 }}>
          {AWARDS.map((award, index) => (
            <AwardDetailCard
              key={award.id}
              id={award.id}
              title={award.title}
              badgeLabel={award.badgeLabel}
              description={award.description}
              count={award.count}
              unit={award.unit}
              value={award.value}
              valueNote={award.valueNote}
              value2={award.value2}
              value2Note={award.value2Note}
              imageRight={index % 2 !== 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
