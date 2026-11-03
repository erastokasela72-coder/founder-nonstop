"use client";

import { useState } from "react";
import TipCard from "./TipCard";
import AppCard from "./AppCard";
import TabNavigation from "./TabNavigation";

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

interface MobileContentProps {
  posts: Post[];
  apps: App[];
}

export default function MobileContent({ posts, apps }: MobileContentProps) {
  const [activeTab, setActiveTab] = useState<"apps" | "tips">("apps");

  return (
    <div className="md:hidden">
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "apps" ? (
        <div className="space-y-3">
          {apps.length > 0 ? (
            apps.map((app) => <AppCard key={app.id} app={app} />)
          ) : (
            <p className="py-4 text-sm text-slate-500">No apps published yet.</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <h1 className="text-lg font-bold tracking-tight text-slate-900 mb-3">
            Growth Tips for Founders
          </h1>
          {posts.length > 0 ? (
            posts.map((post) => <TipCard key={post.id} post={post} />)
          ) : (
            <p className="py-6 text-sm text-slate-500">
              No tips published yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
