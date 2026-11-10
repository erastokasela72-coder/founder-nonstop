import AppCard from "./AppCard";

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

interface MobileContentProps {
  apps: App[];
}

export default function MobileContent({ apps }: MobileContentProps) {
  return (
    <div className="md:hidden space-y-3">
      {apps.length > 0 ? (
        apps.map((app) => <AppCard key={app.id} app={app} />)
      ) : (
        <p className="py-4 text-sm text-slate-500">No apps published yet.</p>
      )}
    </div>
  );
}
