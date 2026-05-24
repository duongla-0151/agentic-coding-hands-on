"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
}

function calcTimeLeft(targetDate: Date): TimeLeft {
  const diff = targetDate.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0 };
  const totalSeconds = Math.floor(diff / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  return {
    days: Math.floor(totalHours / 24),
    hours: totalHours % 24,
    minutes: totalMinutes % 60,
  };
}

function pad(n: number): string {
  return String(Math.max(0, n)).padStart(2, "0");
}

// Figma: 51×82px, radius 8px, blur 16.64px, 0.5px solid #FFEA9E, font 49px Digital Numbers
function DigitCard({ digit }: { digit: string }) {
  return (
    <div style={{ position: "relative", width: 51, height: 82 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 8,
          background:
            "linear-gradient(180deg, #FFF 0%, rgba(255, 255, 255, 0.10) 100%)",
          border: "0.5px solid #FFEA9E",
          backdropFilter: "blur(16.64px)",
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
          fontSize: 49,
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

// Figma: col gap 14px between digit-row and label; digit-row gap 14px; label 24px Montserrat 700 white
function DigitGroup({ value, label }: { value: string; label: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 14,
      }}
    >
      <div style={{ display: "flex", flexDirection: "row", gap: 14 }}>
        {value.split("").map((d, i) => (
          <DigitCard key={i} digit={d} />
        ))}
      </div>
      <span
        style={{
          fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
          fontSize: 24,
          fontWeight: 700,
          color: "#ffffff",
          lineHeight: "32px",
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
    isValidDate ? calcTimeLeft(targetDate) : { days: 0, hours: 0, minutes: 0 }
  );

  const tick = useCallback(() => {
    setTimeLeft(calcTimeLeft(targetDate));
  }, [targetDate]);

  useEffect(() => {
    if (!isValidDate) return;
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [isValidDate, tick]);

  // Figma: "Comming soon" hidden after event datetime passes
  const isActive = timeLeft.days > 0 || timeLeft.hours > 0 || timeLeft.minutes > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {isActive && (
        <p
          style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: 24,
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: "32px",
            margin: 0,
          }}
        >
          Comming soon
        </p>
      )}
      {/* Figma: 3 groups only (DAYS/HOURS/MINUTES), gap 40px, no colon separators */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 40,
          alignItems: "center",
        }}
      >
        <DigitGroup value={pad(timeLeft.days)} label="DAYS" />
        <DigitGroup value={pad(timeLeft.hours)} label="HOURS" />
        <DigitGroup value={pad(timeLeft.minutes)} label="MINUTES" />
      </div>
    </div>
  );
}
