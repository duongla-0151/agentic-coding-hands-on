"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const LANGUAGES = [
  { code: "vi", label: "VN", flag: "🇻🇳" },
  { code: "en", label: "EN", flag: "🇬🇧" },
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
          className="absolute right-0 mt-1 w-28 rounded-md overflow-hidden shadow-lg z-50"
          style={{ background: "rgba(11, 15, 18, 0.95)", border: "1px solid #2E3940" }}
        >
          {LANGUAGES.map((lang) => (
            <li
              key={lang.code}
              role="option"
              aria-selected={lang.code === currentLocale}
              onClick={() => handleLocaleChange(lang.code)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-white cursor-pointer hover:bg-white/10 transition-colors"
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
