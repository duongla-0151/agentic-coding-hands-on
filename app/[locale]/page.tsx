import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  return (
    <main
      className="flex flex-col items-center justify-center min-h-screen text-white"
      style={{ background: "#00101A" }}
    >
      <h1 className="text-3xl font-bold mb-4">Welcome to SAA 2025</h1>
      <p className="text-white/70">{user.email}</p>
    </main>
  );
}
