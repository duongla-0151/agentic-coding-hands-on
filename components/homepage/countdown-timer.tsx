"use client";

import { useState, useEffect } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
}

function calcTimeLeft(targetDate: Date): TimeLeft {
  const diff = targetDate.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0 };
  const totalMinutes = Math.floor(diff / 60000);
  const totalHours = Math.floor(totalMinutes / 60);
  return {
    days: Math.floor(totalHours / 24),
    hours: totalHours % 24,
    minutes: totalMinutes % 60,
  };
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

interface CountdownTimerProps {
  eventDatetime: string; // ISO-8601
}

export function CountdownTimer({ eventDatetime }: CountdownTimerProps) {
  const targetDate = new Date(eventDatetime);
  const isValidDate = !isNaN(targetDate.getTime());
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    isValidDate ? calcTimeLeft(targetDate) : { days: 0, hours: 0, minutes: 0 }
  );

  useEffect(() => {
    if (!isValidDate) return;
    const id = setInterval(() => {
      setTimeLeft(calcTimeLeft(targetDate));
    }, 60000);
    return () => clearInterval(id);
    // targetDate is derived from a stable prop — no need to add as dep
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventDatetime, isValidDate]);

  const isOver = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0;

  const blocks = [
    { label: "DAYS", value: pad(timeLeft.days) },
    { label: "HOURS", value: pad(timeLeft.hours) },
    { label: "MINUTES", value: pad(timeLeft.minutes) },
  ];

  return (
    <div className="flex items-end gap-4">
      {blocks.map(({ label, value }, i) => (
        <div key={label} className="flex items-end gap-4">
          <div className="flex flex-col items-center">
            <div
              className="flex items-center justify-center rounded"
              style={{
                width: 80,
                height: 72,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <span
                className="text-white font-black leading-none"
                style={{
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                  fontSize: "36px",
                  fontWeight: 900,
                }}
              >
                {value}
              </span>
            </div>
            <span
              className="mt-2 text-white/60 tracking-widest"
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                fontSize: "11px",
                fontWeight: 700,
              }}
            >
              {label}
            </span>
          </div>
          {/* Separator colon between blocks (not after last) */}
          {i < blocks.length - 1 && (
            <span
              className="text-white/40 font-bold mb-8"
              style={{ fontSize: "28px", lineHeight: 1 }}
              aria-hidden="true"
            >
              :
            </span>
          )}
        </div>
      ))}

      {!isOver && (
        <p
          className="ml-2 text-white/70 text-sm mb-2"
          style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
        >
          Coming soon
        </p>
      )}
    </div>
  );
}
