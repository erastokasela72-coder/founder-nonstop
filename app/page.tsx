import { supabase } from "@/lib/supabase";
import AppCard from "@/app/components/AppCard";
import MobileContent from "@/app/components/MobileContent";
import { Metadata } from "next";

export const instant = false;

type App = {
  id: string;
  name: string;
  logo_path: string | null;
  monthly_revenue: number | null;
  revenue_type: string;
  revenue_currency: string;
  revenue_period: string;
  description: string | null;
  growth_story: string;
  website_url: string | null;
  published: boolean;
  created_at: string;
};

async function getApps() {
  const { data } = await supabase
    .from("apps")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });
  return data || [];
}

export async function generateMetadata(): Promise<Metadata> {
  const apps = await getApps();

  const appNames = apps.slice(0, 5).map(app => app.name).join(", ");

  return {
    title: "founderNonstop - Learn from Successful Founders",
    description: `Discover how ${appNames || 'successful founders'} grew their apps. Explore ${apps.length} real SaaS businesses making money.`,
    openGraph: {
      title: "founderNonstop - Learn from Successful Founders",
      description: `Discover how ${appNames || 'successful founders'} grew their apps. Explore ${apps.length} real SaaS businesses making money.`,
    },
    twitter: {
      title: "founderNonstop - Learn from Successful Founders",
      description: `Discover how ${appNames || 'successful founders'} grew their apps. Explore ${apps.length} real SaaS businesses making money.`,
    },
  };
}

export default async function Home() {
  const apps = await getApps();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
        {/* Logo and description - centered on all devices */}
        <header className="text-center mb-6 sm:mb-8 lg:mb-10">
          <a href="/" className="inline-block cursor-pointer hover:opacity-80 transition">
            <img
              src="/twor.png"
              alt="founderNonstop"
              className="h-16 sm:h-20 md:h-24 w-auto object-contain"
            />
          </a>
          <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed px-2">
            founderNonstop is a discovery platform for solo founders to explore apps and SaaS businesses making money, learn how they grew, and get practical growth tips to build and grow their own businesses.
          </p>
        </header>

        {/* Mobile/Tablet view - single column */}
        <MobileContent apps={apps} />

        {/* Desktop view - responsive grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          {apps.length > 0 ? (
            apps.map((app) => <AppCard key={app.id} app={app} />)
          ) : (
            <p className="col-span-full py-4 text-sm text-slate-500">No apps published yet.</p>
          )}
        </div>
      </div>
    </main>
  );
}
