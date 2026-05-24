"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(targetDate: Date): TimeLeft {
  const diff = targetDate.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const totalSeconds = Math.floor(diff / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  return {
    days: Math.floor(totalHours / 24),
    hours: totalHours % 24,
    minutes: totalMinutes % 60,
    seconds: totalSeconds % 60,
  };
}

function pad(n: number): string {
  return String(Math.max(0, n)).padStart(2, "0");
}

function isDone(t: TimeLeft): boolean {
  return t.days === 0 && t.hours === 0 && t.minutes === 0 && t.seconds === 0;
}

function DigitCard({ digit }: { digit: string }) {
  return (
    <div style={{ position: "relative", width: 77, height: 123 }}>
      {/* Frosted glass card — opacity 0.5 on bg layer only, digit stays fully opaque */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 12,
          background:
            "linear-gradient(180deg, #FFF 0%, rgba(255, 255, 255, 0.10) 100%)",
          border: "0.75px solid #FFEA9E",
          backdropFilter: "blur(25px)",
          opacity: 0.5,
        }}
      />
      {/* key=digit causes React to remount this div on change, restarting the animation */}
      <div
        key={digit}
        className="countdown-digit"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: '"Digital Numbers", monospace',
          fontSize: 73.73,
          fontWeight: 400,
          color: "#ffffff",
          lineHeight: 1,
          overflow: "hidden",
        }}
      >
        {digit}
      </div>
    </div>
  );
}

function Colon() {
  return (
    <span
      style={{
        fontFamily: '"Digital Numbers", monospace',
        fontSize: 73.73,
        fontWeight: 400,
        color: "#ffffff",
        lineHeight: 1,
        paddingTop: 20,
        userSelect: "none",
      }}
    >
      :
    </span>
  );
}

function DigitGroup({ value, label }: { value: string; label: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 21,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 21,
          alignItems: "center",
        }}
      >
        {value.split("").map((d, i) => (
          <DigitCard key={i} digit={d} />
        ))}
      </div>
      <span
        style={{
          fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
          fontSize: 36,
          fontWeight: 700,
          color: "#ffffff",
          lineHeight: "48px",
          letterSpacing: 0,
        }}
      >
        {label}
      </span>
    </div>
  );
}

interface PrelaunchCountdownProps {
  eventDatetime: string;
  locale: string;
  onLaunched?: () => void;
}

export function PrelaunchCountdown({
  eventDatetime,
  locale,
  onLaunched,
}: PrelaunchCountdownProps) {
  const router = useRouter();
  const targetDate = useMemo(() => new Date(eventDatetime), [eventDatetime]);
  const isValidDate = !isNaN(targetDate.getTime());

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    isValidDate ? calcTimeLeft(targetDate) : { days: 0, hours: 0, minutes: 0, seconds: 0 }
  );

  const handleLaunched = useCallback(() => {
    if (onLaunched) {
      onLaunched();
    } else {
      router.push(`/${locale}`);
    }
  }, [onLaunched, router, locale]);

  useEffect(() => {
    if (!isValidDate) return;
    // Already past on mount — redirect immediately, skip interval
    if (isDone(calcTimeLeft(targetDate))) {
      handleLaunched();
      return;
    }
    // 1 s cadence for exact redirect and smooth digit animation
    const id = setInterval(() => {
      const next = calcTimeLeft(targetDate);
      setTimeLeft(next);
      if (isDone(next)) {
        clearInterval(id);
        handleLaunched();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [targetDate, isValidDate, handleLaunched]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24,
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
          fontSize: 36,
          fontWeight: 700,
          color: "#ffffff",
          lineHeight: "48px",
          letterSpacing: 0,
          textAlign: "center",
          margin: 0,
        }}
      >
        Sự kiện sẽ bắt đầu sau
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 40,
          alignItems: "flex-start",
        }}
      >
        <DigitGroup value={pad(timeLeft.days)} label="DAYS" />
        <Colon />
        <DigitGroup value={pad(timeLeft.hours)} label="HOURS" />
        <Colon />
        <DigitGroup value={pad(timeLeft.minutes)} label="MINUTES" />
        <Colon />
        <DigitGroup value={pad(timeLeft.seconds)} label="SECONDS" />
      </div>
    </div>
  );
}
