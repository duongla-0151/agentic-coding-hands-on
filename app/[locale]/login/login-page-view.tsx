import { LoginHeader } from "./login-header";
import { LoginButton } from "./login-button";
import { LoginFooter } from "./login-footer";

export interface LoginPageViewProps {
  title: string;
  subtitle: string;
  cta: string;
  loginLabel: string;
  footerText: string;
  onLogin: () => Promise<void>;
  onLocaleChange: (locale: string) => void;
  currentLocale: string;
  isLoading: boolean;
}

const KEY_VISUAL_GRADIENT = `
  radial-gradient(ellipse at 85% 20%, rgba(180, 80, 20, 0.85) 0%, transparent 40%),
  radial-gradient(ellipse at 95% 45%, rgba(140, 60, 10, 0.6) 0%, transparent 35%),
  radial-gradient(ellipse at 78% 65%, rgba(20, 100, 75, 0.7) 0%, transparent 38%),
  radial-gradient(ellipse at 88% 80%, rgba(60, 25, 100, 0.65) 0%, transparent 35%),
  radial-gradient(ellipse at 70% 35%, rgba(200, 100, 30, 0.4) 0%, transparent 45%),
  #00101A
`.trim();

const LEFT_OVERLAY =
  "linear-gradient(90deg, #00101A 0%, #00101A 25.41%, rgba(0,16,26,0) 100%)";

const BOTTOM_OVERLAY =
  "linear-gradient(0deg, #00101A 22.48%, rgba(0,19,32,0) 51.74%)";

export function LoginPageView({
  title,
  subtitle,
  cta,
  loginLabel,
  footerText,
  onLogin,
  onLocaleChange,
  currentLocale,
  isLoading,
}: LoginPageViewProps) {
  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: "#00101A" }}
    >
      {/* Key visual background */}
      <div
        aria-hidden="true"
        style={{ background: KEY_VISUAL_GRADIENT, position: "absolute", inset: 0, zIndex: 0 }}
      />

      {/* Left gradient overlay */}
      <div
        aria-hidden="true"
        style={{ background: LEFT_OVERLAY, position: "absolute", inset: 0, zIndex: 1 }}
      />

      {/* Bottom gradient overlay */}
      <div
        aria-hidden="true"
        style={{ background: BOTTOM_OVERLAY, position: "absolute", inset: 0, zIndex: 1 }}
      />

      {/* Header */}
      <LoginHeader currentLocale={currentLocale} onLocaleChange={onLocaleChange} />

      {/* Main content */}
      <main
        className="relative flex flex-col justify-center min-h-screen"
        style={{ padding: "96px 144px", zIndex: 2, paddingTop: "calc(80px + 96px)" }}
      >
        {/* "ROOT FURTHER" hero title */}
        <h1
          className="text-white uppercase leading-none mb-6"
          style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(72px, 8vw, 120px)",
            lineHeight: 1,
          }}
        >
          {title}
        </h1>

        {/* Description */}
        <div
          className="text-white mb-10"
          style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontWeight: 700,
            fontSize: "20px",
            lineHeight: "40px",
          }}
        >
          <p>{subtitle}</p>
          <p>{cta}</p>
        </div>

        {/* Login button */}
        <LoginButton label={loginLabel} onClick={onLogin} isLoading={isLoading} />
      </main>

      {/* Footer */}
      <LoginFooter text={footerText} />
    </div>
  );
}
