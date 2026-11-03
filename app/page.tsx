import { supabase } from "@/lib/supabase";
import TipCard from "@/app/components/TipCard";
import AppCard from "@/app/components/AppCard";
import MobileContent from "@/app/components/MobileContent";
import { Metadata } from "next";

export const instant = false;

type Post = {
  id: string;
  title: string;
  content: Array<{ subtitle?: string; content: string }> | string;
  published: boolean;
  created_at: string;
};

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

async function getPosts() {
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });
  return data || [];
}

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
  const posts = await getPosts();

  const appNames = apps.slice(0, 5).map(app => app.name).join(", ");
  const postTitles = posts.slice(0, 3).map(post => post.title).join(", ");

  return {
    title: "founderNonstop - Learn from Successful Founders",
    description: `Discover how ${appNames || 'successful founders'} grew their apps. Learn from ${posts.length} growth tips and explore ${apps.length} real SaaS businesses making money.`,
    openGraph: {
      title: "founderNonstop - Learn from Successful Founders",
      description: `Discover how ${appNames || 'successful founders'} grew their apps. Learn from ${posts.length} growth tips and explore ${apps.length} real SaaS businesses making money.`,
    },
    twitter: {
      title: "founderNonstop - Learn from Successful Founders",
      description: `Discover how ${appNames || 'successful founders'} grew their apps. Learn from ${posts.length} growth tips and explore ${apps.length} real SaaS businesses making money.`,
    },
  };
}

export default async function Home() {
  const [posts, apps] = await Promise.all([getPosts(), getApps()]);

  const leftApps = apps.slice(0, Math.ceil(apps.length / 2));
  const rightApps = apps.slice(Math.ceil(apps.length / 2));

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

        {/* Mobile/Tablet view with tabs */}
        <MobileContent posts={posts} apps={apps} />

        {/* Desktop view - 3 column grid */}
        <div className="hidden md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:grid-cols-[minmax(0,1fr)_minmax(360px,1.4fr)_minmax(0,1fr)] md:gap-10 lg:gap-12 items-start">
          <aside className="order-1 lg:order-1">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">
              Apps
            </h2>

            {leftApps.length > 0 ? (
              leftApps.map((app) => <AppCard key={app.id} app={app} />)
            ) : (
              <p className="py-4 text-sm text-slate-500">No apps published yet.</p>
            )}
          </aside>

          <section className="order-2 min-w-0 lg:order-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 mb-4">
              Growth Tips for Founders
            </h1>

            <div className="space-y-4">
              {posts.length > 0 ? (
                posts.map((post) => <TipCard key={post.id} post={post} />)
              ) : (
                <p className="py-6 text-sm text-slate-500">
                  No tips published yet.
                </p>
              )}
            </div>
          </section>

          <aside className="order-3 lg:order-3">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">
              More apps
            </h2>

            {rightApps.length > 0 ? (
              rightApps.map((app) => <AppCard key={app.id} app={app} />)
            ) : (
              <p className="py-4 text-sm text-slate-500">No apps published yet.</p>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
