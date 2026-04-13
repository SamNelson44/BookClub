import { requireProfile } from "@/lib/auth";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { MobileNav } from "@/components/layout/MobileNav";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireProfile();

  return (
    <div className="min-h-screen bg-parchment dark:bg-stone-950">
      <Sidebar profile={profile} />
      <TopBar />

      {/* Main content offset for sidebar on desktop */}
      <div className="lg:pl-72 pb-20 lg:pb-0">
        <main className="max-w-5xl mx-auto px-4 py-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
