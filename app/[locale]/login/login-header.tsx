"use client";

import { useState, useRef, useEffect } from "react";

interface LanguageOption {
  code: string;
  label: string;
  flag: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: "vi", label: "VN", flag: "🇻🇳" },
  { code: "en", label: "EN", flag: "🇬🇧" },
];

interface HeaderProps {
  currentLocale: string;
  onLocaleChange: (locale: string) => void;
}

export function LoginHeader({ currentLocale, onLocaleChange }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const current =
    LANGUAGES.find((l) => l.code === currentLocale) ?? LANGUAGES[0];

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
      style={{
        height: "80px",
        padding: "12px 144px",
        background: "rgba(11, 15, 18, 0.8)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M10 2L11.8 7.2H17.6L12.9 10.4L14.7 15.6L10 12.4L5.3 15.6L7.1 10.4L2.4 7.2H8.2L10 2Z"
            fill="#FFEA9E"
          />
        </svg>
        <span
          className="font-bold text-white tracking-wide"
          style={{ fontFamily: "Montserrat, sans-serif", fontSize: "15px" }}
        >
          Sun* Annual Awards 2025
        </span>
      </div>

      {/* Language selector */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 px-3 py-2 rounded-md text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span>{current.flag}</span>
          <span className="text-sm font-medium">{current.label}</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className={`transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          >
            <path d="M2 4L6 8L10 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {open && (
          <ul
            role="listbox"
            className="absolute right-0 mt-1 w-28 rounded-md overflow-hidden shadow-lg"
            style={{ background: "rgba(11, 15, 18, 0.95)", border: "1px solid #2E3940" }}
          >
            {LANGUAGES.map((lang) => (
              <li
                key={lang.code}
                role="option"
                aria-selected={lang.code === currentLocale}
                onClick={() => {
                  onLocaleChange(lang.code);
                  setOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-white cursor-pointer hover:bg-white/10 transition-colors"
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </header>
  );
}
