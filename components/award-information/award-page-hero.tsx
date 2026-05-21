import Image from "next/image";

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
        <h1>
          <Image
            src="/images/keyvisual/award-page-hero.png"
            alt="ROOT FURTHER"
            width={400}
            height={178}
            priority
            style={{ display: "block", objectFit: "contain", objectPosition: "left" }}
          />
        </h1>
      </div>
    </section>
  );
}
