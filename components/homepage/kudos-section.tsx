interface KudosSectionProps {
  locale: string;
}

export function KudosSection({ locale }: KudosSectionProps) {
  return (
    <section
      id="kudos"
      className="w-full overflow-hidden"
      style={{ background: "#00101A", padding: "0 144px 80px" }}
    >
      <div
        className="relative flex items-center justify-between rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(255,234,158,0.12) 0%, rgba(255,234,158,0.04) 100%)",
          border: "1px solid rgba(255,234,158,0.2)",
          padding: "56px 64px",
          minHeight: "220px",
        }}
      >
        {/* Decorative accent */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "40%",
            background:
              "radial-gradient(ellipse at 80% 50%, rgba(255,234,158,0.18) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Left: text content */}
        <div className="relative z-10 flex flex-col gap-3 max-w-lg">
          <p
            className="uppercase tracking-widest"
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              color: "#FFEA9E",
              opacity: 0.7,
            }}
          >
            Phong trào ghi nhận
          </p>
          <h2
            className="text-white font-black"
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontSize: "clamp(28px, 3vw, 40px)",
              fontWeight: 900,
            }}
          >
            Sun* Kudos
          </h2>
          <p
            className="uppercase tracking-widest mb-1"
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontSize: "10px",
              fontWeight: 700,
              color: "#FFEA9E",
            }}
          >
            Điểm mới của SAA 2025
          </p>
          <p
            className="text-white/60"
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontSize: "13px",
              lineHeight: "1.75",
            }}
          >
            Hoạt động ghi nhận và cảm ơn đồng nghiệp — lần đầu tiên được điền ra dành cho tất cả Sunner.
            Hoạt động sẽ được triển khai vào tháng 11/2025, khuyến khích người Sun* chia sẻ những lời ghi
            nhận, cảm ơn đồng nghiệp trên hệ thống do BTC công bố. Đây sẽ là chất liệu để Hội đồng Heads
            tham khảo trong quá trình lựa chọn người đạt giải.
          </p>
          <div className="mt-2">
            <a
              href={`/${locale}/kudos`}
              className="inline-flex items-center justify-center font-bold uppercase tracking-wider transition-opacity hover:opacity-85"
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                fontSize: "13px",
                fontWeight: 700,
                background: "#FFEA9E",
                color: "#00101A",
                borderRadius: "999px",
                padding: "12px 28px",
              }}
            >
              Chi tiết <span aria-hidden="true" className="ml-1">↗</span>
            </a>
          </div>
        </div>

        {/* Right: Sun* Kudos logo */}
        <div
          className="relative z-10 shrink-0 hidden md:flex flex-col items-center justify-center gap-2"
          style={{ minWidth: 180 }}
        >
          {/* Sun* flame icon */}
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
            <path
              d="M18 4C18 4 12 10 12 18C12 22.4 14.6 26.2 18 28C21.4 26.2 24 22.4 24 18C24 10 18 4 18 4Z"
              fill="#FFEA9E"
              opacity="0.9"
            />
            <path
              d="M18 10C18 10 14 15 14 20C14 23.3 15.8 26 18 27C20.2 26 22 23.3 22 20C22 15 18 10 18 10Z"
              fill="#00101A"
              opacity="0.5"
            />
          </svg>
          <span
            className="font-black tracking-tight"
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontSize: "48px",
              fontWeight: 900,
              color: "#FFEA9E",
              userSelect: "none",
              lineHeight: 1,
            }}
            aria-hidden="true"
          >
            KUDOS
          </span>
        </div>
      </div>
    </section>
  );
}
