import Image from "next/image";
import { getTranslations } from "next-intl/server";

export async function AboutSection() {
  const t = await getTranslations("About");

  const PARAGRAPHS = [t("para1"), t("para2"), t("para3")];
  const PARAGRAPHS_2 = [t("para4"), t("para5")];

  return (
    <section
      id="about-detail"
      style={{ background: "#00101A", padding: "0 144px 80px" }}
    >
      {/* Heading */}
      <div className="mb-10">
        <h2 className="leading-none flex flex-col gap-2 items-start">
          <Image
            src="/images/awards/root-text.png"
            alt="ROOT"
            width={340}
            height={121}
            style={{ objectFit: "contain", objectPosition: "left" }}
          />
          <Image
            src="/images/awards/further-text.png"
            alt="FURTHER"
            width={440}
            height={102}
            style={{ objectFit: "contain", objectPosition: "left" }}
          />
        </h2>
      </div>

      {/* First set of paragraphs */}
      <div className="flex flex-col gap-5 mb-10">
        {PARAGRAPHS.map((text, i) => (
          <p
            key={i}
            className="text-white/70 leading-relaxed"
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontSize: "15px",
              lineHeight: "1.8",
            }}
          >
            {text}
          </p>
        ))}
      </div>

      {/* Quote block */}
      <blockquote
        className="text-center my-12"
        style={{ borderLeft: "none" }}
      >
        <p
          className="text-white font-bold italic mb-3"
          style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: "clamp(16px, 1.5vw, 20px)",
          }}
        >
          &ldquo;A tree with deep roots fears no storm&rdquo;
        </p>
        <cite
          className="not-italic"
          style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: "13px",
            color: "#FFEA9E",
            opacity: 0.8,
          }}
        >
          {t("quote")}
        </cite>
      </blockquote>

      {/* Second set of paragraphs */}
      <div className="flex flex-col gap-5">
        {PARAGRAPHS_2.map((text, i) => (
          <p
            key={i}
            className="text-white/70 leading-relaxed"
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontSize: "15px",
              lineHeight: "1.8",
            }}
          >
            {text}
          </p>
        ))}
      </div>
    </section>
  );
}
