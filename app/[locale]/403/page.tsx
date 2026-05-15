export default function ForbiddenPage() {
  return (
    <main
      className="flex flex-col items-center justify-center min-h-screen"
      style={{ background: '#00101A' }}
    >
      <h1 className="text-4xl font-bold text-white mb-4">403</h1>
      <p className="text-white/70 mb-8">You don&apos;t have permission to access this page.</p>
      <a href="/" className="text-[#FFEA9E] underline">Go home</a>
    </main>
  );
}
