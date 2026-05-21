const KEY_VISUAL_GRADIENT = `
  radial-gradient(ellipse at 85% 20%, rgba(180, 80, 20, 0.85) 0%, transparent 40%),
  radial-gradient(ellipse at 95% 45%, rgba(140, 60, 10, 0.6) 0%, transparent 35%),
  radial-gradient(ellipse at 78% 65%, rgba(20, 100, 75, 0.7) 0%, transparent 38%),
  radial-gradient(ellipse at 88% 80%, rgba(60, 25, 100, 0.65) 0%, transparent 35%),
  radial-gradient(ellipse at 70% 35%, rgba(200, 100, 30, 0.4) 0%, transparent 45%),
  #00101A
`.trim();

const LEFT_OVERLAY =
  "linear-gradient(90deg, #00101A 0%, #00101A 20%, rgba(0,16,26,0) 100%)";

const BOTTOM_OVERLAY =
  "linear-gradient(0deg, #00101A 15%, rgba(0,19,32,0) 60%)";

export function AwardPageHero() {
  return (
    <section
      aria-label="Keyvisual"
      className="relative w-full overflow-hidden"
      style={{ height: "420px", background: "#00101A", paddingTop: "80px" }}
    >
      <div
        aria-hidden="true"
        style={{ background: KEY_VISUAL_GRADIENT, position: "absolute", inset: 0, zIndex: 0 }}
      />
      <div
        aria-hidden="true"
        style={{ background: LEFT_OVERLAY, position: "absolute", inset: 0, zIndex: 1 }}
      />
      <div
        aria-hidden="true"
        style={{ background: BOTTOM_OVERLAY, position: "absolute", inset: 0, zIndex: 1 }}
      />

      <div
        className="relative flex flex-col justify-center h-full"
        style={{ padding: "0 144px", zIndex: 2 }}
      >
        <p
          className="uppercase tracking-widest mb-3"
          style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: "11px",
            fontWeight: 700,
            color: "rgba(255,234,158,0.7)",
          }}
        >
          Sun* annual awards 2025
        </p>
        <h1
          className="text-white uppercase leading-none"
          style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(56px, 7vw, 96px)",
            lineHeight: 1,
          }}
        >
          ROOT FURTHER
        </h1>
      </div>
    </section>
  );
}
