import Image from "next/image";
import { CountdownTimer } from "./countdown-timer";

const LEFT_OVERLAY =
  "linear-gradient(90deg, #00101A 0%, #00101A 25.41%, rgba(0,16,26,0) 100%)";

const BOTTOM_OVERLAY =
  "linear-gradient(0deg, #00101A 22.48%, rgba(0,19,32,0) 51.74%)";

interface HeroSectionProps {
  locale: string;
  eventDatetime: string;
}

export function HeroSection({ locale, eventDatetime }: HeroSectionProps) {
  return (
    <section
      id="about"
      className="relative w-full overflow-hidden"
      style={{ minHeight: "100vh", background: "#00101A" }}
    >
      {/* Key visual background */}
      <Image
        src="/images/keyvisual/keyvisual-bg.png"
        alt=""
        fill
        priority
        loading="eager"
        sizes="100vw"
        aria-hidden="true"
        style={{ objectFit: "cover", objectPosition: "right center", zIndex: 0 }}
      />
      {/* Left gradient overlay */}
      <div
        aria-hidden="true"
        style={{ background: LEFT_OVERLAY, position: "absolute", inset: 0, zIndex: 1 }}
      />
      {/* Bottom gradient overlay */}
      <div
        aria-hidden="true"
        style={{ background: BOTTOM_OVERLAY, position: "absolute", inset: 0, zIndex: 1 }}
      />

      {/* Content */}
      <div
        className="relative flex flex-col justify-center"
        style={{
          minHeight: "100vh",
          padding: "0 144px",
          paddingTop: "calc(80px + 80px)",
          paddingBottom: "80px",
          zIndex: 2,
        }}
      >
        {/* Hero title — 40px gap to countdown */}
        <h1 className="mb-10">
          <Image
            src="/images/keyvisual/homepage-hero.png"
            alt="ROOT FURTHER"
            width={520}
            height={231}
            priority
            style={{ display: "block", objectFit: "contain", objectPosition: "left" }}
          />
        </h1>

        {/* Countdown + Event info — 16px inner gap, 40px gap before CTA */}
        <div className="mb-10 flex flex-col" style={{ gap: 16 }}>
          <CountdownTimer eventDatetime={eventDatetime} />

          {/* Event info */}
          <div className="flex flex-col" style={{ gap: 8 }}>
            <p
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                fontSize: 16,
                fontWeight: 400,
                color: "#ffffff",
                margin: 0,
              }}
            >
              {"Thời gian: "}
              <span style={{ fontSize: 24, fontWeight: 700, color: "#FFEA9E" }}>
                26/12/2025
              </span>
              {"  |  Địa điểm: "}
              <span style={{ fontSize: 24, fontWeight: 700, color: "#FFEA9E" }}>
                Âu Cơ Art Center
              </span>
            </p>
            <p
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                fontSize: 16,
                fontWeight: 400,
                color: "rgba(255,255,255,0.6)",
                letterSpacing: "0.5px",
                margin: 0,
              }}
            >
              Tường thuật trực tiếp qua sóng Livestream
            </p>
          </div>
        </div>

        {/* CTA buttons — 40px gap, 8px radius, 22px font */}
        <div className="flex items-center" style={{ gap: 40 }}>
          <a
            href={`/${locale}/awards`}
            className="inline-flex items-center justify-center font-bold tracking-wider uppercase transition-colors"
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontSize: 22,
              fontWeight: 700,
              background: "#FFEA9E",
              color: "#00101A",
              borderRadius: 8,
              padding: "16px 24px",
            }}
          >
            ABOUT AWARDS
          </a>
          <a
            href={`/${locale}/kudos`}
            className="inline-flex items-center justify-center font-bold tracking-wider uppercase transition-colors"
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontSize: 22,
              fontWeight: 700,
              color: "#FFEA9E",
              border: "1px solid #998C5F",
              background: "rgba(255,234,158,0.10)",
              borderRadius: 8,
              padding: "16px 24px",
            }}
          >
            ABOUT KUDOS
          </a>
        </div>
      </div>
    </section>
  );
}
