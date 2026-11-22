"use client";

import { useState } from "react";

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

interface AppModalProps {
  app: App;
  onClose: () => void;
}

function AppModal({ app, onClose }: AppModalProps) {
  const formatGrowthStory = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.startsWith('*')) {
        return <li key={index} className="ml-4">{trimmed.substring(1).trim()}</li>;
      }
      if (trimmed.match(/^\d+\./)) {
        return <li key={index} className="ml-4">{trimmed}</li>;
      }
      if (trimmed) {
        return <p key={index} className="mb-2">{trimmed}</p>;
      }
      return null;
    });
  };

  const logo = app.logo_path ? (
    <img
      src={app.logo_path}
      alt={app.name}
      className="h-16 w-16 rounded-xl object-cover"
    />
  ) : (
    <span className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl font-semibold text-2xl ${
      ["bg-blue-100 text-blue-700",
       "bg-sky-100 text-sky-700",
       "bg-cyan-100 text-cyan-700",
       "bg-indigo-100 text-indigo-700",
       "bg-teal-100 text-teal-700",
       "bg-blue-50 text-blue-600"][app.name.charCodeAt(0) % 6]
    }`}>
      {app.name.charAt(0).toUpperCase()}
    </span>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            {logo}
            <div>
              <h2 className="text-xl font-bold text-slate-900">{app.name}</h2>
              <p className="text-sm text-blue-600 font-medium mt-1">
                {app.monthly_revenue
                  ? `$${app.monthly_revenue.toLocaleString()} ${app.revenue_currency} ${app.revenue_period.toUpperCase()} (${app.revenue_type})`
                  : "Revenue not disclosed"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition p-1"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {app.description && (
          <p className="text-sm text-slate-600 mb-4">{app.description}</p>
        )}
        <div className="border-t border-slate-200 pt-4">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Growth Story</h3>
          <div className="text-sm text-slate-600 leading-relaxed">
            {formatGrowthStory(app.growth_story)}
          </div>
        </div>
        {app.website_url && (
          <div className="mt-6 pt-4 border-t border-slate-200">
            <a
              href={app.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Visit Website
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AppCard({ app }: { app: App }) {
  const [showModal, setShowModal] = useState(false);
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
      className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl object-cover"
    />
  ) : (
    <span
      className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl font-semibold text-xs sm:text-sm ${color}`}
    >
      {app.name.charAt(0).toUpperCase()}
    </span>
  );

  const revenueText = app.monthly_revenue
    ? `$${app.monthly_revenue.toLocaleString()} ${app.revenue_currency} ${app.revenue_period.toUpperCase()} (${app.revenue_type})`
    : "Revenue not disclosed";

  const formatGrowthStoryPreview = (text: string) => {
    const lines = text.split('\n').slice(0, 3);
    return lines.map((line, index) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.startsWith('*')) {
        return <span key={index} className="block">• {trimmed.substring(1).trim()}</span>;
      }
      if (trimmed.match(/^\d+\./)) {
        return <span key={index} className="block">{trimmed}</span>;
      }
      if (trimmed) {
        return <span key={index} className="block">{trimmed}</span>;
      }
      return null;
    });
  };

  const hasMoreText = app.growth_story.length > 150;

  return (
    <>
      <div className="border border-slate-200 rounded-2xl p-3 sm:p-4 mb-2 sm:mb-3 bg-white hover:border-blue-300 hover:shadow-lg transition-all duration-200 h-48 flex flex-col">
        <div className="flex items-start gap-2 sm:gap-3 shrink-0">
          {logo}

          <div className="min-w-0 flex-1">
            <span className="block text-xs sm:text-sm font-semibold text-slate-900">
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

        <div className="mt-2 sm:mt-3 flex-1 flex flex-col min-h-0">
          <p className="text-xs sm:text-sm leading-5 sm:leading-6 text-slate-600 line-clamp-3 mb-2 overflow-hidden">
            {formatGrowthStoryPreview(app.growth_story)}
          </p>
          <div className="flex items-center justify-between mt-auto shrink-0">
            {hasMoreText && (
              <button
                onClick={() => setShowModal(true)}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer shrink-0"
              >
                Read more
              </button>
            )}
            {app.website_url && (
              <a
                href={app.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg p-1.5 sm:p-2 text-blue-500 transition hover:text-blue-600 hover:bg-slate-50 cursor-pointer shrink-0"
                aria-label={`Visit ${app.name}`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-4 w-4 sm:h-5 sm:w-5"
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
      </div>
      {showModal && <AppModal app={app} onClose={() => setShowModal(false)} />}
    </>
  );
}
