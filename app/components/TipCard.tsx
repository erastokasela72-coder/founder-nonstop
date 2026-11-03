"use client";

import { useState } from "react";

type Post = {
  id: string;
  title: string;
  content: Array<{ subtitle?: string; content: string }> | string;
  published: boolean;
  created_at: string;
};

export default function TipCard({ post }: { post: Post }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = Array.isArray(post.content) 
    ? post.content 
    : typeof post.content === 'string' 
      ? [{ content: post.content }]
      : [{ content: String(post.content) }];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlideData = slides[currentSlide];
  const subtitle = typeof currentSlideData === 'object' && currentSlideData !== null ? currentSlideData.subtitle : undefined;
  const content = typeof currentSlideData === 'object' && currentSlideData !== null 
    ? (currentSlideData.content || String(currentSlideData))
    : String(currentSlideData);

  return (
    <article className="border border-slate-200 rounded-2xl p-4 sm:p-5 bg-white shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-200">
      <h2 className="text-sm sm:text-base font-bold leading-6 text-slate-900">
        {post.title}
      </h2>

      <div className="mt-3">
        {subtitle && (
          <h3 className="text-xs sm:text-sm font-bold text-slate-800 mb-2">
            {subtitle}
          </h3>
        )}
        <p className="text-xs sm:text-sm leading-6 sm:leading-7 text-slate-600">
          {content}
        </p>

        {slides.length > 1 && (
          <div className="mt-4 flex items-center justify-between gap-2">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="rounded-lg border border-slate-200 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition"
            >
              ← Previous
            </button>
            <span className="text-xs text-slate-500">
              {currentSlide + 1} / {slides.length}
            </span>
            <button
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
              className="rounded-lg border border-slate-200 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
