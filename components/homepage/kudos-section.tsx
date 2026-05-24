import Image from "next/image";

interface KudosSectionProps {
  locale: string;
}

const MONTSERRAT = "var(--font-montserrat), Montserrat, sans-serif";

export function KudosSection({ locale }: KudosSectionProps) {
  return (
    <section
      id="kudos"
      className="w-full overflow-hidden"
      style={{ background: "#00101A", padding: "0 144px 80px" }}
    >
      {/* Card — 1120px (52px inset from 1224px content area), borderRadius 16px */}
      <div
        className="relative overflow-hidden"
        style={{
          margin: "0 52px",
          borderRadius: 16,
          height: 500,
        }}
      >
        {/* Background image */}
        <Image
          src="/images/keyvisual/kudos-section-bg.png"
          alt=""
          fill
          sizes="1120px"
          aria-hidden="true"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />

        {/* Card inner content — padding 46px 64px */}
        <div
          className="relative z-10 flex items-center justify-between"
          style={{ padding: "46px 64px", height: "100%" }}
        >
          {/* Left: text + button — flex-col gap 32px (between text block and button) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 32,
              width: 457,
            }}
          >
            {/* Frame 494: label + title + description — gap 16px */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
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
                Phong trào ghi nhận
              </p>
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
                Sun* Kudos
              </h2>
              {/* Single merged description block — ĐIỂM MỚI header + body */}
              <p
                style={{
                  fontFamily: MONTSERRAT,
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#ffffff",
                  lineHeight: "24px",
                  letterSpacing: "0.5px",
                  textAlign: "justify",
                  margin: 0,
                  whiteSpace: "pre-line",
                }}
              >
                {`ĐIỂM MỚI CỦA SAA 2025\nHoạt động ghi nhận và cảm ơn đồng nghiệp — lần đầu tiên được diễn ra dành cho tất cả Sunner. Hoạt động sẽ được triển khai vào tháng 11/2025, khuyến khích người Sun* chia sẻ những lời ghi nhận, cảm ơn đồng nghiệp trên hệ thống do BTC công bố. Đây sẽ là chất liệu để Hội đồng Heads tham khảo trong quá trình lựa chọn người đạt giải.`}
              </p>
            </div>

            {/* Frame 495: Chi tiết button — borderRadius 4px, yellow bg */}
            <div>
              <a
                href={`/${locale}/kudos`}
                className="inline-flex items-center transition-opacity hover:opacity-85"
                style={{
                  fontFamily: MONTSERRAT,
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#00101A",
                  background: "#FFEA9E",
                  borderRadius: 4,
                  padding: "16px",
                  gap: 8,
                  textDecoration: "none",
                  lineHeight: "24px",
                }}
              >
                Chi tiết <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          {/* Right: Sun* Kudos logo */}
          <div className="shrink-0 hidden md:flex items-center">
            <Image
              src="/images/keyvisual/kudos-logo.svg"
              alt="Sun* KUDOS"
              width={364}
              height={74}
              unoptimized
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
