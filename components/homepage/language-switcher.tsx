"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

function FlagVN() {
  return (
    <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 2, flexShrink: 0 }}>
      <rect width="24" height="16" fill="#DA251D"/>
      <polygon points="12,2.4 13.4,6.8 18,6.8 14.3,9.4 15.7,13.8 12,11.2 8.3,13.8 9.7,9.4 6,6.8 10.6,6.8" fill="#FFFF00"/>
    </svg>
  );
}

function FlagEN() {
  return (
    <svg width="24" height="16" viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 2, flexShrink: 0 }}>
      <rect width="60" height="40" fill="#012169"/>
      <path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" strokeWidth="8"/>
      <path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="5" clipPath="url(#center)"/>
      <path d="M30,0 V40 M0,20 H60" stroke="#fff" strokeWidth="13"/>
      <path d="M30,0 V40 M0,20 H60" stroke="#C8102E" strokeWidth="8"/>
    </svg>
  );
}

const LANGUAGES = [
  { code: "vi", label: "VN", Flag: FlagVN },
  { code: "en", label: "EN", Flag: FlagEN },
];

interface LanguageSwitcherProps {
  currentLocale: string;
}

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const current = LANGUAGES.find((l) => l.code === currentLocale) ?? LANGUAGES[0];
  const CurrentFlag = current.Flag;

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  function handleLocaleChange(newLocale: string) {
    // Replace the current locale prefix in the pathname
    const newPath = pathname.replace(/^\/(vi|en)/, `/${newLocale}`);
    router.push(newPath);
    setOpen(false);
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 rounded-md text-white hover:bg-white/10 transition-colors cursor-pointer"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Switch language"
      >
        <CurrentFlag />
        <span className="text-sm font-medium">{current.label}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path
            d="M2 4L6 8L10 4"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 mt-2 overflow-hidden shadow-xl z-50"
          style={{
            background: "#0D0D0D",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 16,
            minWidth: 140,
          }}
        >
          {LANGUAGES.map(({ code, label, Flag }) => (
            <li
              key={code}
              role="option"
              aria-selected={code === currentLocale}
              onClick={() => handleLocaleChange(code)}
              className="flex items-center gap-3 px-5 py-4 text-white cursor-pointer hover:bg-white/10 transition-colors"
              style={{
                fontSize: 16,
                fontWeight: code === currentLocale ? 700 : 500,
                background: code === currentLocale ? "rgba(255,255,255,0.08)" : undefined,
              }}
            >
              <Flag />
              <span>{label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
