import Image from "next/image";
import { getTranslations } from "next-intl/server";

interface KudosSectionProps {
  locale: string;
}

const MONTSERRAT = "var(--font-montserrat), Montserrat, sans-serif";

export async function KudosSection({ locale }: KudosSectionProps) {
  const t = await getTranslations("KudosSection");

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

        {/* Card inner content */}
        <div
          className="relative z-10 flex items-center justify-between"
          style={{ padding: "46px 64px", height: "100%" }}
        >
          {/* Left: text + button */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 32,
              width: 457,
            }}
          >
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
                {t("movement")}
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
                {t("description")}
              </p>
            </div>

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
                {t("details")} <span aria-hidden="true">↗</span>
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
