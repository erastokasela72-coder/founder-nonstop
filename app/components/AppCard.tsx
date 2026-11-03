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

export default function AppCard({ app }: { app: App }) {
  const colors = [
    "bg-blue-100 text-blue-700",
    "bg-sky-100 text-sky-700",
    "bg-cyan-100 text-cyan-700",
    "bg-indigo-100 text-indigo-700",
    "bg-teal-100 text-teal-700",
    "bg-blue-50 text-blue-600",
  ];
  const colorIndex = app.name.charCodeAt(0) % colors.length;
  const color = colors[colorIndex];
  const logo = app.logo_path ? (
    <img
      src={app.logo_path}
      alt={app.name}
      className="h-10 w-10 rounded-xl object-cover"
    />
  ) : (
    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-semibold ${color}`}
    >
      {app.name.charAt(0).toUpperCase()}
    </span>
  );

  const revenueText = app.monthly_revenue
    ? `$${app.monthly_revenue.toLocaleString()} ${app.revenue_currency} ${app.revenue_period.toUpperCase()} (${app.revenue_type})`
    : "Revenue not disclosed";

  return (
    <div className="border border-slate-200 rounded-2xl p-4 mb-3 bg-white hover:border-blue-300 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start gap-3">
        {logo}

        <div className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-slate-900">
            {app.name}
          </span>
          <span className="mt-1 block text-xs text-blue-600 font-medium">
            {revenueText}
          </span>
          {app.description && (
            <span className="mt-1 block text-xs text-slate-500 line-clamp-1">
              {app.description}
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-start justify-between gap-3">
        <p className="text-sm leading-6 text-slate-600 flex-1">
          {app.growth_story}
        </p>
        {app.website_url && (
          <a
            href={app.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center justify-center rounded-lg p-2 text-blue-500 transition hover:text-blue-600 hover:bg-slate-50 cursor-pointer"
            aria-label={`Visit ${app.name}`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
