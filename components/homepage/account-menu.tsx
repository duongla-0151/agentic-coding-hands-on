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
          className="absolute right-0 mt-2 w-48 rounded-md overflow-hidden shadow-xl z-50"
          style={{ background: "rgba(11, 15, 18, 0.97)", border: "1px solid #2E3940" }}
          role="menu"
        >
          <li role="none">
            <a
              href="#"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-sm text-white hover:bg-white/10 transition-colors"
              role="menuitem"
            >
              Profile
            </a>
          </li>
          {isAdmin && (
            <li role="none">
              <a
                href={`/${locale}/admin`}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-sm text-white hover:bg-white/10 transition-colors"
                role="menuitem"
              >
                Admin Dashboard
              </a>
            </li>
          )}
          <li role="none">
            <button
              onClick={handleSignOut}
              className="w-full text-left px-4 py-3 text-sm hover:bg-white/10 transition-colors cursor-pointer"
              style={{ color: "#FFEA9E" }}
              role="menuitem"
            >
              Sign out
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
