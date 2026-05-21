"use client";

const HERO_TIERS = [
  {
    label: "New Hero",
    color: "#4CAF82",
    condition: "Có 1-4 người gửi Kudos cho bạn",
    desc: "Hành trình lan tỏa điều tốt đẹp bắt đầu – những lời cảm ơn và ghi nhận đầu tiên đã tìm đến bạn.",
  },
  {
    label: "Rising Hero",
    color: "#F59E0B",
    condition: "Có 5-9 người gửi Kudos cho bạn",
    desc: "Hình ảnh bạn đang lớn dần trong trái tim đồng đội bằng sự tử tế và cống hiến của mình.",
  },
  {
    label: "Super Hero",
    color: "#8B5CF6",
    condition: "Có 10-20 người gửi Kudos cho bạn",
    desc: "Bạn đã trở thành biểu tượng được tin tưởng và yêu quý, người luôn sẵn sàng hỗ trợ và được nhiều đồng đội nhớ đến.",
  },
  {
    label: "Legend Hero",
    color: "#FFEA9E",
    condition: "Có hơn 20 người gửi Kudos cho bạn",
    desc: "Bạn đã trở thành huyền thoại – người để lại dấu ấn khó quên trong tập thể bằng trái tim và hành động của mình.",
  },
];

const SAA_ICONS = [
  { label: "REVIVAL", gradient: "linear-gradient(135deg, #0f4c3a, #1a7a5e)" },
  { label: "TOUCH OF LIGHT", gradient: "linear-gradient(135deg, #0d3b6e, #1a6fa8)" },
  { label: "STAY GOLD", gradient: "linear-gradient(135deg, #7c3800, #d46a00)" },
  { label: "FLOW TO HORIZON", gradient: "linear-gradient(135deg, #1a0a3b, #3b1a6e)" },
  { label: "BEYOND THE BOUNDARY", gradient: "linear-gradient(135deg, #0a1a3b, #1e3a6e)" },
  { label: "ROOT FURTHER", gradient: "linear-gradient(135deg, #001018, #003050)" },
];

const FONT = "var(--font-montserrat), Montserrat, sans-serif";

interface TheLeModalProps {
  onClose: () => void;
  onWriteKudos: () => void;
}

export function TheLeModal({ onClose, onWriteKudos }: TheLeModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="flex flex-col h-full overflow-hidden shadow-2xl"
        style={{ width: "min(520px, 100vw)", background: "#061520", borderLeft: "1px solid rgba(255,234,158,0.15)" }}
        role="dialog"
        aria-modal="true"
        aria-label="Thể lệ"
      >
        {/* Header */}
        <div className="shrink-0 px-8 pt-8 pb-4">
          <h2
            className="font-black"
            style={{ fontFamily: FONT, fontSize: "32px", fontWeight: 900, color: "#FFEA9E" }}
          >
            Thể lệ
          </h2>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-8 pb-4 flex flex-col gap-8">

          {/* Section 1: Người nhận Kudos */}
          <section>
            <h3
              className="font-black uppercase mb-3"
              style={{ fontFamily: FONT, fontSize: "13px", fontWeight: 900, color: "#FFEA9E", lineHeight: 1.4 }}
            >
              Người nhận Kudos: Huy hiệu Hero cho những ảnh hưởng tích cực
            </h3>
            <p className="text-white/60 mb-4" style={{ fontFamily: FONT, fontSize: "13px", lineHeight: 1.7 }}>
              Dựa trên số lượng đồng đội gửi trao Kudos, bạn sẽ sở hữu Huy hiệu Hero tương ứng, được hiển thị trực tiếp cạnh tên profile.
            </p>
            <div className="flex flex-col gap-4">
              {HERO_TIERS.map((tier) => (
                <div key={tier.label} className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <span
                      className="font-bold text-xs px-2 py-1 rounded-full shrink-0"
                      style={{ fontFamily: FONT, background: `${tier.color}22`, color: tier.color, border: `1px solid ${tier.color}55` }}
                    >
                      {tier.label}
                    </span>
                    <span className="text-white/80 text-xs font-semibold" style={{ fontFamily: FONT }}>
                      {tier.condition}
                    </span>
                  </div>
                  <p className="text-white/50 text-xs leading-relaxed pl-1" style={{ fontFamily: FONT }}>
                    {tier.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: Người gửi Kudos */}
          <section>
            <h3
              className="font-black uppercase mb-3"
              style={{ fontFamily: FONT, fontSize: "13px", fontWeight: 900, color: "#FFEA9E", lineHeight: 1.4 }}
            >
              Người gửi Kudos: Sưu tập trọn bộ 6 icon, nhận ngay phần quà bí ẩn
            </h3>
            <p className="text-white/60 mb-5" style={{ fontFamily: FONT, fontSize: "13px", lineHeight: 1.7 }}>
              Mỗi lời Kudos bạn gửi sẽ được đăng tải trên hệ thống và nhận về những lượt ♥ từ cộng đồng Sunner.
              Cứ mỗi 5 lượt ♥, bạn sẽ được mở 1 Secret Box, với cơ hội nhận về một trong 6 icon độc quyền của SAA.
            </p>
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
              {SAA_ICONS.map((icon) => (
                <div key={icon.label} className="flex flex-col items-center gap-2">
                  <div
                    className="rounded-full flex items-center justify-center"
                    style={{ width: 72, height: 72, background: icon.gradient, border: "1.5px solid rgba(255,234,158,0.2)" }}
                  >
                    <span style={{ fontSize: "9px", color: "rgba(255,234,158,0.7)", fontFamily: FONT, fontWeight: 700, textAlign: "center", padding: "4px" }}>
                      {icon.label}
                    </span>
                  </div>
                  <span className="text-white/60 text-center uppercase" style={{ fontFamily: FONT, fontSize: "9px", fontWeight: 700, letterSpacing: "0.05em" }}>
                    {icon.label}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-white/50 mt-4 text-xs" style={{ fontFamily: FONT, lineHeight: 1.7 }}>
              Những Sunner thu thập trọn bộ 6 icon sẽ nhận về một phần quà bí ẩn từ SAA 2025.
            </p>
          </section>

          {/* Section 3: Kudos Quốc Dân */}
          <section>
            <h3
              className="font-black uppercase mb-3"
              style={{ fontFamily: FONT, fontSize: "13px", fontWeight: 900, color: "#FFEA9E" }}
            >
              Kudos Quốc Dân
            </h3>
            <p className="text-white/60 text-xs" style={{ fontFamily: FONT, lineHeight: 1.7 }}>
              5 Kudos nhận về nhiều ♥ nhất toàn Sun* sẽ chính thức trở thành Kudos Quốc Dân và được trao phần quà đặc biệt từ SAA 2025: Root Further.
            </p>
          </section>
        </div>

        {/* Sticky footer */}
        <div
          className="shrink-0 flex items-center gap-3 px-8 py-5"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)", background: "#061520" }}
        >
          <button
            onClick={onClose}
            className="flex items-center gap-2 font-bold transition-colors hover:bg-white/10 rounded-full"
            style={{ fontFamily: FONT, fontSize: "13px", fontWeight: 700, color: "rgba(255,255,255,0.7)", border: "1.5px solid rgba(255,255,255,0.2)", padding: "10px 20px" }}
          >
            <span aria-hidden="true">✕</span> Đóng
          </button>
          <button
            onClick={onWriteKudos}
            className="flex-1 flex items-center justify-center gap-2 font-bold rounded-full transition-opacity hover:opacity-85"
            style={{ fontFamily: FONT, fontSize: "13px", fontWeight: 700, background: "#FFEA9E", color: "#00101A", padding: "10px 20px" }}
          >
            <span aria-hidden="true">✏</span> Viết KUDOS
          </button>
        </div>
      </div>
    </div>
  );
}
