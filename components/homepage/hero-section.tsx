import { CountdownTimer } from "./countdown-timer";

const KEY_VISUAL_GRADIENT = `
  radial-gradient(ellipse at 85% 20%, rgba(180, 80, 20, 0.85) 0%, transparent 40%),
  radial-gradient(ellipse at 95% 45%, rgba(140, 60, 10, 0.6) 0%, transparent 35%),
  radial-gradient(ellipse at 78% 65%, rgba(20, 100, 75, 0.7) 0%, transparent 38%),
  radial-gradient(ellipse at 88% 80%, rgba(60, 25, 100, 0.65) 0%, transparent 35%),
  radial-gradient(ellipse at 70% 35%, rgba(200, 100, 30, 0.4) 0%, transparent 45%),
  #00101A
`.trim();

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
      {/* Key visual */}
      <div
        aria-hidden="true"
        style={{ background: KEY_VISUAL_GRADIENT, position: "absolute", inset: 0, zIndex: 0 }}
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
        {/* Hero title */}
        <h1
          className="text-white uppercase leading-none mb-6"
          style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(72px, 8vw, 120px)",
            lineHeight: 1,
          }}
        >
          ROOT FURTHER
        </h1>

        {/* Countdown with "Comming soon" label */}
        <div className="mb-8">
          <p
            className="text-white/60 mb-3 uppercase tracking-widest"
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontSize: "11px",
              fontWeight: 700,
            }}
          >
            Comming soon
          </p>
          <CountdownTimer eventDatetime={eventDatetime} />
        </div>

        {/* Event info */}
        <div className="mb-8 flex flex-col gap-1">
          <p
            className="text-white/80"
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontSize: "15px",
              fontWeight: 600,
            }}
          >
            Thời gian: 26/12/2025 &nbsp;|&nbsp; Địa điểm: Âu Cơ Art Center
          </p>
          <p
            className="text-white/60"
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontSize: "14px",
            }}
          >
            Tường thuật trực tiếp qua sóng Livestream
          </p>
        </div>

        {/* CTA buttons */}
        <div className="flex items-center gap-4">
          <a
            href={`/${locale}/awards`}
            className="inline-flex items-center justify-center font-bold tracking-wider uppercase transition-colors"
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontSize: "13px",
              fontWeight: 700,
              background: "#FFEA9E",
              color: "#00101A",
              borderRadius: "999px",
              padding: "14px 32px",
            }}
          >
            ABOUT AWARDS
          </a>
          <a
            href={`/${locale}/kudos`}
            className="inline-flex items-center justify-center font-bold tracking-wider uppercase transition-colors hover:bg-[#FFEA9E]/10"
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontSize: "13px",
              fontWeight: 700,
              color: "#FFEA9E",
              border: "1.5px solid #FFEA9E",
              borderRadius: "999px",
              padding: "14px 32px",
            }}
          >
            ABOUT KUDOS
          </a>
        </div>
      </div>
    </section>
  );
}
