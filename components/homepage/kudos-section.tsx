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
            className="text-white/60"
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontSize: "14px",
              lineHeight: "1.7",
            }}
          >
            Ghi nhận và lan toả những điều tốt đẹp trong cộng đồng Sun*. Hãy cùng nhau tạo nên văn hóa trân trọng lẫn nhau.
          </p>
          <div className="mt-2">
            <a
              href={`/${locale}/kudos`}
              className="inline-flex items-center justify-center font-bold uppercase tracking-wider transition-colors"
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
              Chi tiết
            </a>
          </div>
        </div>

        {/* Right: Kudos label */}
        <div
          className="relative z-10 shrink-0 hidden md:flex items-center justify-center"
          style={{
            width: 180,
            height: 100,
          }}
        >
          <span
            className="font-black tracking-tight"
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontSize: "42px",
              fontWeight: 900,
              color: "#FFEA9E",
              opacity: 0.25,
              userSelect: "none",
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
