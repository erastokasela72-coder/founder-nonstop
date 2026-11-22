"use client";

import { useState } from "react";

export default function SEOContent() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="mt-12 sm:mt-16 border-t border-slate-200 pt-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left text-xs sm:text-sm text-slate-400 hover:text-slate-500 transition flex items-center justify-between"
      >
        <span>Learn more about app ideas and growth strategies</span>
        <svg
          className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isExpanded && (
        <div className="mt-4 text-xs sm:text-sm text-slate-400 leading-relaxed space-y-3">
          <p>
            Looking for <strong className="text-slate-500">app ideas</strong> that actually make money? founderNonstop showcases real mobile apps and SaaS businesses built by solo founders who have successfully grown their products. Explore our collection of profitable apps and learn the exact strategies they used to achieve growth.
          </p>
          <p>
            Whether you're searching for <strong className="text-slate-500">mobile app ideas</strong>, wondering <strong className="text-slate-500">how to grow mobile apps</strong>, or need inspiration for your next startup, our platform provides real-world examples from founders who have been there. Each app listing includes detailed growth stories, revenue metrics, and actionable insights you can apply to your own projects.
          </p>
          <p>
            From SaaS tools to consumer mobile apps, discover what works in today's market. Learn how founders acquired their first users, scaled their user base, and built sustainable revenue streams. Get inspired by successful app ideas and growth strategies that you can adapt for your own business.
          </p>
        </div>
      )}
    </section>
  );
}
