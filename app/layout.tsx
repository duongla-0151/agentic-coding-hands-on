// Root layout defers html/body rendering to [locale]/layout.tsx
// so the lang attribute can be set dynamically per locale.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
