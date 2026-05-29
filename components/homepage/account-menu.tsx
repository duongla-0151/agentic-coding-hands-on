"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AccountMenuProps {
  locale: string;
  isAdmin: boolean;
}

export function AccountMenu({ locale, isAdmin }: AccountMenuProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  async function handleSignOut() {
    setOpen(false);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) {
        // Sign-out failed server-side — do not navigate; session is still active
        console.error("Sign-out failed:", await res.text());
        return;
      }
    } catch {
      // Network error — cannot confirm sign-out; do not navigate
      console.error("Sign-out request failed (network error)");
      return;
    }
    router.push(`/${locale}/login`);
    router.refresh();
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center rounded-full hover:bg-white/10 transition-colors cursor-pointer"
        style={{ width: 40, height: 40 }}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Account menu"
      >
        {/* User icon */}
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
          <circle cx="11" cy="7" r="4" stroke="white" strokeWidth="1.5" />
          <path
            d="M3 19c0-4 3.6-7 8-7s8 3 8 7"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {open && (
        <ul
          className="absolute right-0 mt-2 overflow-hidden shadow-xl z-50"
          style={{
            background: "#0D0D0D",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 16,
            minWidth: 180,
          }}
          role="menu"
        >
          <li role="none">
            <a
              href={`/${locale}`}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between px-5 py-4 text-white hover:bg-white/10 transition-colors"
              style={{ fontSize: 15, fontWeight: 600, textDecoration: "none" }}
              role="menuitem"
            >
              <span>Profile</span>
              <svg width="18" height="18" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                <circle cx="11" cy="7" r="4" stroke="white" strokeWidth="1.5" />
                <path d="M3 19c0-4 3.6-7 8-7s8 3 8 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </a>
          </li>
          {isAdmin && (
            <li role="none">
              <a
                href={`/${locale}/admin`}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between px-5 py-4 text-white hover:bg-white/10 transition-colors"
                style={{ fontSize: 15, fontWeight: 600, textDecoration: "none" }}
                role="menuitem"
              >
                <span>Dashboard</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="3" y="3" width="7" height="7" rx="1" stroke="white" strokeWidth="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1" stroke="white" strokeWidth="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1" stroke="white" strokeWidth="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1" stroke="white" strokeWidth="1.5" />
                </svg>
              </a>
            </li>
          )}
          <li role="none">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-between px-5 py-4 text-white hover:bg-white/10 transition-colors cursor-pointer"
              style={{ fontSize: 15, fontWeight: 600 }}
              role="menuitem"
            >
              <span>Logout</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="16,17 21,12 16,7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="21" y1="12" x2="9" y2="12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
