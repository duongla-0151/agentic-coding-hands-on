"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

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

// Smaller scale than prelaunch (56×90 vs 77×123) to fit within HeroSection
function DigitCard({ digit }: { digit: string }) {
  return (
    <div style={{ position: "relative", width: 56, height: 90 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 9,
          background:
            "linear-gradient(180deg, #FFF 0%, rgba(255, 255, 255, 0.10) 100%)",
          border: "0.75px solid #FFEA9E",
          backdropFilter: "blur(25px)",
          opacity: 0.5,
        }}
      />
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
          fontSize: 52,
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
        fontSize: 52,
        fontWeight: 400,
        color: "#ffffff",
        lineHeight: 1,
        paddingTop: 14,
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
        gap: 10,
      }}
    >
      <div style={{ display: "flex", flexDirection: "row", gap: 8 }}>
        {value.split("").map((d, i) => (
          <DigitCard key={i} digit={d} />
        ))}
      </div>
      <span
        style={{
          fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
          fontSize: 11,
          fontWeight: 700,
          color: "rgba(255,255,255,0.6)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    </div>
  );
}

interface CountdownTimerProps {
  eventDatetime: string;
}

export function CountdownTimer({ eventDatetime }: CountdownTimerProps) {
  const targetDate = useMemo(() => new Date(eventDatetime), [eventDatetime]);
  const isValidDate = !isNaN(targetDate.getTime());

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    isValidDate
      ? calcTimeLeft(targetDate)
      : { days: 0, hours: 0, minutes: 0, seconds: 0 }
  );

  const tick = useCallback(() => {
    setTimeLeft(calcTimeLeft(targetDate));
  }, [targetDate]);

  useEffect(() => {
    if (!isValidDate) return;
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [isValidDate, tick]);

  const isActive =
    timeLeft.days > 0 ||
    timeLeft.hours > 0 ||
    timeLeft.minutes > 0 ||
    timeLeft.seconds > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {isActive && (
        <p
          style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            color: "rgba(255,255,255,0.6)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          Coming soon
        </p>
      )}
      <div style={{ display: "flex", flexDirection: "row", gap: 12, alignItems: "flex-start" }}>
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
