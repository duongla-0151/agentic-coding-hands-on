import Image from "next/image";
import { PrelaunchCountdown } from "@/components/countdown/prelaunch-countdown";

const LEFT_OVERLAY =
  "linear-gradient(90deg, #00101A 0%, #00101A 30%, rgba(0,16,26,0.6) 60%, rgba(0,16,26,0) 100%)";

const EVENT_DATETIME =
  process.env.NEXT_PUBLIC_EVENT_DATETIME ?? "2025-12-31T18:30:00+07:00";

export default async function PrelaunchPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#00101A",
        overflow: "hidden",
      }}
    >
      {/* Keyvisual background image */}
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

      {/* Dark left gradient overlay */}
      <div
        aria-hidden="true"
        style={{
          background: LEFT_OVERLAY,
          position: "absolute",
          inset: 0,
          zIndex: 1,
        }}
      />

      {/* Centered content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <PrelaunchCountdown eventDatetime={EVENT_DATETIME} locale={locale} />
      </div>
    </div>
  );
}
