"use client";

interface LoginButtonProps {
  label: string;
  onClick: () => Promise<void>;
  isLoading: boolean;
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M19.6 10.23c0-.68-.06-1.36-.18-2H10v3.77h5.4c-.23 1.22-.94 2.25-2 2.94v2.44h3.24c1.9-1.74 2.96-4.32 2.96-7.15z"
        fill="#4285F4"
      />
      <path
        d="M10 20c2.7 0 4.97-.9 6.62-2.42l-3.24-2.44c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.75-5.59-4.12H1.07v2.52A10 10 0 0010 20z"
        fill="#34A853"
      />
      <path
        d="M4.41 11.98A6.03 6.03 0 014.1 10c0-.69.12-1.36.31-1.98V5.5H1.07A10 10 0 000 10c0 1.62.38 3.14 1.07 4.5l3.34-2.52z"
        fill="#FBBC05"
      />
      <path
        d="M10 3.96c1.46 0 2.78.5 3.82 1.5l2.86-2.86C14.96.9 12.7 0 10 0A10 10 0 001.07 5.5l3.34 2.52C5.2 5.71 7.4 3.96 10 3.96z"
        fill="#EA4335"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="8" stroke="#1a1a1a" strokeWidth="2" strokeOpacity="0.25" />
      <path
        d="M18 10a8 8 0 00-8-8"
        stroke="#1a1a1a"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function LoginButton({ label, onClick, isLoading }: LoginButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="flex items-center justify-center rounded-lg font-bold transition-all hover:shadow-lg hover:shadow-yellow-400/30 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
      style={{
        width: "305px",
        height: "60px",
        background: "#FFEA9E",
        borderRadius: "8px",
        padding: "16px 24px",
        color: "#1a1a1a",
        fontFamily: "Montserrat, sans-serif",
        fontWeight: 700,
        fontSize: "15px",
        gap: "8px",
      }}
      aria-busy={isLoading}
    >
      {isLoading ? <Spinner /> : <GoogleIcon />}
      <span>{label}</span>
    </button>
  );
}
