"use client";

import { useState } from "react";

type Tab = "apps" | "tips";

interface TabNavigationProps {
  onTabChange: (tab: Tab) => void;
  activeTab: Tab;
}

export default function TabNavigation({ onTabChange, activeTab }: TabNavigationProps) {
  return (
    <div className="flex gap-2 mb-6">
      <button
        onClick={() => onTabChange("apps")}
        className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition cursor-pointer ${
          activeTab === "apps"
            ? "bg-blue-600 text-white shadow-sm"
            : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
        }`}
      >
        Apps
      </button>
      <button
        onClick={() => onTabChange("tips")}
        className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition cursor-pointer ${
          activeTab === "tips"
            ? "bg-blue-600 text-white shadow-sm"
            : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
        }`}
      >
        Growth Tips
      </button>
    </div>
  );
}
