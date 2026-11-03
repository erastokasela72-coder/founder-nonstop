
"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

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

export default function PostPage() {
  const [activeTab, setActiveTab] = useState<"create-tip" | "create-app" | "manage-tip" | "manage-app">("create-tip");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [apps, setApps] = useState<App[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editingApp, setEditingApp] = useState<App | null>(null);
  const [editingLogoPreview, setEditingLogoPreview] = useState<string | null>(null);
  const [editingLogoFile, setEditingLogoFile] = useState<File | null>(null);
  const [appSearchQuery, setAppSearchQuery] = useState("");
  const [tipSlides, setTipSlides] = useState<Array<{ subtitle: string; content: string }>>([{ subtitle: "", content: "" }]);
  const [editingTipSlides, setEditingTipSlides] = useState<Array<{ subtitle: string; content: string }>>([]);
  const tipFormRef = useRef<HTMLFormElement>(null);
  const appFormRef = useRef<HTMLFormElement>(null);

  function handleLogoUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Please choose an image smaller than 2 MB.");
      return;
    }

    setLogoFile(file);

    const reader = new FileReader();

    reader.onload = () => {
      setLogoPreview(reader.result as string);
    };

    reader.readAsDataURL(file);
  }

  function handleEditingLogoUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Please choose an image smaller than 2 MB.");
      return;
    }

    setEditingLogoFile(file);

    const reader = new FileReader();

    reader.onload = () => {
      setEditingLogoPreview(reader.result as string);
    };

    reader.readAsDataURL(file);
  }

  async function uploadLogoToStorage(file: File): Promise<string | null> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    console.log('Uploading logo to:', filePath);
    console.log('File size:', file.size, 'File type:', file.type);

    // Create a fresh copy of the file to avoid ERR_UPLOAD_FILE_CHANGED
    const fileCopy = new File([file], fileName, { type: file.type });

    const { error: uploadError } = await supabase.storage
      .from('app-logos')
      .upload(filePath, fileCopy);

    if (uploadError) {
      console.error('Error uploading logo:', uploadError);
      console.error('Error details:', JSON.stringify(uploadError, null, 2));
      alert('Upload error: ' + uploadError.message + '\nCheck console for details');
      return null;
    }

    const { data } = supabase.storage
      .from('app-logos')
      .getPublicUrl(filePath);

    console.log('Public URL:', data.publicUrl);
    return data.publicUrl;
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const labelClass =
    "mb-2 block text-sm font-medium text-slate-700";

  useEffect(() => {
    fetchPosts();
    fetchApps();
  }, []);

  async function fetchPosts() {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    setPosts(data || []);
  }

  async function fetchApps() {
    const { data } = await supabase
      .from("apps")
      .select("*")
      .order("created_at", { ascending: false });
    console.log('Fetched apps:', data);
    setApps(data || []);
  }

  async function deletePost(id: string) {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) {
      alert("Failed to delete post: " + error.message);
    } else {
      await fetchPosts();
    }
  }

  async function deleteApp(id: string) {
    const { error } = await supabase.from("apps").delete().eq("id", id);
    if (error) {
      alert("Failed to delete app: " + error.message);
    } else {
      await fetchApps();
    }
  }

  async function updatePost(post: Post) {
    const { error } = await supabase
      .from("posts")
      .update({ title: post.title, content: post.content })
      .eq("id", post.id);
    if (error) {
      alert("Failed to update post: " + error.message);
    } else {
      await fetchPosts();
      setEditingPost(null);
    }
  }

  async function updateApp(app: App) {
    let logoPath = app.logo_path;

    if (editingLogoFile) {
      logoPath = await uploadLogoToStorage(editingLogoFile);
      if (!logoPath) {
        alert("Failed to upload logo. Please try again.");
        return;
      }
    }

    const { error } = await supabase
      .from("apps")
      .update({
        name: app.name,
        logo_path: logoPath,
        monthly_revenue: app.monthly_revenue,
        revenue_type: app.revenue_type,
        revenue_period: app.revenue_period,
        description: app.description,
        growth_story: app.growth_story,
        website_url: app.website_url,
      })
      .eq("id", app.id);
    if (error) {
      alert("Failed to update app: " + error.message);
    } else {
      await fetchApps();
      setEditingApp(null);
      setEditingLogoPreview(null);
      setEditingLogoFile(null);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 px-4 py-8 sm:px-5 sm:py-10 md:py-14">
      <div className="mx-auto max-w-2xl">
        <header className="mb-10 text-center">
          <a href="/" className="inline-block cursor-pointer hover:opacity-80 transition">
            <img
              src="/twor.png"
              alt="founderNonstop"
              className="h-24 w-auto object-contain"
            />
          </a>

          <h1 className="mt-8 text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
            Posts
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Create and manage growth tips and app stories.
          </p>
        </header>

        <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab("create-tip")}
            className={`rounded-lg px-3 py-3 text-xs sm:text-sm font-medium transition cursor-pointer ${
              activeTab === "create-tip"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Create Tip
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("create-app")}
            className={`rounded-lg px-3 py-3 text-xs sm:text-sm font-medium transition cursor-pointer ${
              activeTab === "create-app"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Create App
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("manage-tip")}
            className={`rounded-lg px-3 py-3 text-xs sm:text-sm font-medium transition cursor-pointer ${
              activeTab === "manage-tip"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Manage Tips
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("manage-app")}
            className={`rounded-lg px-3 py-3 text-xs sm:text-sm font-medium transition cursor-pointer ${
              activeTab === "manage-app"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Manage Apps
          </button>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          {activeTab === "create-tip" ? (
            <form
              ref={tipFormRef}
              className="space-y-6"
              onSubmit={async (event) => {
                event.preventDefault();
                setIsSubmitting(true);

                const formData = new FormData(event.currentTarget);
                const title = formData.get("title") as string;
                const validSlides = tipSlides.filter(slide => slide.content.trim().length > 0);

                if (validSlides.length === 0) {
                  alert("Please add at least one slide with content.");
                  setIsSubmitting(false);
                  return;
                }

                const { error } = await supabase
                  .from("posts")
                  .insert({ title, content: validSlides, published: true });

                setIsSubmitting(false);

                if (error) {
                  alert("Failed to save post: " + error.message);
                } else {
                  alert("Growth tip published successfully!");
                  tipFormRef.current?.reset();
                  setTipSlides([{ subtitle: "", content: "" }]);
                }
              }}
            >
              <div>
                <label htmlFor="tip-title" className={labelClass}>
                  Title
                </label>
                <input
                  id="tip-title"
                  name="title"
                  type="text"
                  required
                  maxLength={120}
                  placeholder="e.g. Find customers before building"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Tip slides
                </label>
                <div className="space-y-3">
                  {tipSlides.map((slide, index) => (
                    <div key={index} className="relative space-y-2">
                      <input
                        type="text"
                        value={slide.subtitle}
                        onChange={(e) => {
                          const newSlides = [...tipSlides];
                          newSlides[index] = { ...newSlides[index], subtitle: e.target.value };
                          setTipSlides(newSlides);
                        }}
                        placeholder={`Slide ${index + 1} subtitle (optional)`}
                        className={`${inputClass} font-semibold`}
                      />
                      <textarea
                        value={slide.content}
                        onChange={(e) => {
                          const newSlides = [...tipSlides];
                          newSlides[index] = { ...newSlides[index], content: e.target.value };
                          setTipSlides(newSlides);
                        }}
                        required={index === 0}
                        minLength={10}
                        rows={4}
                        placeholder={`Slide ${index + 1} content: Share the lesson, strategy, or experience...`}
                        className={`${inputClass} resize-y leading-6`}
                      />
                      {tipSlides.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newSlides = tipSlides.filter((_, i) => i !== index);
                            setTipSlides(newSlides);
                          }}
                          className="rounded-lg bg-red-100 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-200 cursor-pointer transition"
                        >
                          Remove slide
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setTipSlides([...tipSlides, { subtitle: "", content: "" }])}
                    className="w-full rounded-lg border-2 border-dashed border-slate-300 px-4 py-3 text-sm font-medium text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                  >
                    + Add another slide
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 cursor-pointer shadow-sm hover:shadow-md"
              >
                {isSubmitting ? "Publishing..." : "Publish tip"}
              </button>
            </form>
          ) : activeTab === "create-app" ? (
            <form
              ref={appFormRef}
              className="space-y-6"
              onSubmit={async (event) => {
                event.preventDefault();
                setIsSubmitting(true);

                const formData = new FormData(event.currentTarget);
                const name = formData.get("appName") as string;
                const revenue = formData.get("revenue") as string;
                const revenuePeriod = formData.get("revenuePeriod") as string;
                const description = formData.get("description") as string;
                const growthStory = formData.get("growth") as string;
                const websiteUrl = formData.get("websiteUrl") as string;

                let logoPath = null;
                if (logoFile) {
                  logoPath = await uploadLogoToStorage(logoFile);
                  if (!logoPath) {
                    setIsSubmitting(false);
                    alert("Failed to upload logo. Please try again.");
                    return;
                  }
                }

                const { error } = await supabase.from("apps").insert({
                  name,
                  logo_path: logoPath,
                  monthly_revenue: revenue ? parseFloat(revenue) : null,
                  revenue_type: revenue ? "estimated" : "undisclosed",
                  revenue_currency: "USD",
                  revenue_period: revenuePeriod || "mrr",
                  description: description || null,
                  growth_story: growthStory,
                  website_url: websiteUrl || null,
                  published: true,
                });

                setIsSubmitting(false);

                if (error) {
                  alert("Failed to save app story: " + error.message);
                } else {
                  alert("App story published successfully!");
                  appFormRef.current?.reset();
                  setLogoPreview(null);
                  setLogoFile(null);
                }
              }}
            >
              <div>
                <label htmlFor="app-name" className={labelClass}>
                  App name
                </label>
                <input
                  id="app-name"
                  name="appName"
                  type="text"
                  required
                  maxLength={100}
                  placeholder="e.g. My SaaS"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>App logo</label>

                <label className="flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-slate-300 p-4 transition hover:border-blue-400 hover:bg-blue-50">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="App logo preview"
                      className="h-14 w-14 rounded-xl border border-gray-200 object-cover"
                    />
                  ) : (
                    <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        className="h-7 w-7"
                        aria-hidden="true"
                      >
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="3"
                        />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="m21 15-5-5L5 21" />
                      </svg>
                    </span>
                  )}

                  <span>
                    <span className="block text-sm font-medium text-slate-700">
                      {logoPreview ? "Change logo" : "Upload logo"}
                    </span>
                    <span className="mt-1 block text-xs text-slate-400">
                      PNG, JPG or WebP · Max 2 MB
                    </span>
                  </span>

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="sr-only"
                    onChange={handleLogoUpload}
                  />
                </label>
              </div>

              <div>
                <label htmlFor="app-revenue" className={labelClass}>
                  Monthly revenue (USD)
                </label>
                <input
                  id="app-revenue"
                  name="revenue"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 5000"
                  className={inputClass}
                />
                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Use a verified figure or estimate, and identify which it is.
                  Leave blank if unknown.
                </p>
              </div>

              <div>
                <label htmlFor="app-revenue-period" className={labelClass}>
                  Revenue period
                </label>
                <select
                  id="app-revenue-period"
                  name="revenuePeriod"
                  className={inputClass}
                >
                  <option value="mrr">MRR (Monthly Recurring Revenue)</option>
                  <option value="arr">ARR (Annual Recurring Revenue)</option>
                </select>
              </div>

              <div>
                <label htmlFor="app-description" className={labelClass}>
                  What does the app do?
                </label>
                <textarea
                  id="app-description"
                  name="description"
                  rows={3}
                  placeholder="Briefly describe what the app does..."
                  className={`${inputClass} resize-y leading-6`}
                />
              </div>

              <div>
                <label htmlFor="app-growth" className={labelClass}>
                  How did it grow?
                </label>
                <textarea
                  id="app-growth"
                  name="growth"
                  required
                  minLength={10}
                  rows={8}
                  placeholder="Explain how the product started, found customers, makes money, and grew its revenue..."
                  className={`${inputClass} resize-y leading-6`}
                />
              </div>

              <div>
                <label htmlFor="app-website" className={labelClass}>
                  Website URL (optional)
                </label>
                <input
                  id="app-website"
                  name="websiteUrl"
                  type="url"
                  placeholder="https://example.com"
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 cursor-pointer shadow-sm hover:shadow-md"
              >
                {isSubmitting ? "Publishing..." : "Publish app story"}
              </button>
            </form>
          ) : activeTab === "manage-tip" ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Manage Tips</h2>
              {posts.length === 0 ? (
                <p className="text-center text-slate-500 py-10">No posts yet.</p>
              ) : (
                posts.map((post) => (
                  <div
                    key={post.id}
                    className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    {editingPost?.id === post.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editingPost.title}
                          onChange={(e) =>
                            setEditingPost({ ...editingPost, title: e.target.value })
                          }
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                        />
                        <div className="space-y-2">
                          {editingTipSlides.map((slide, index) => (
                            <div key={index} className="space-y-2">
                              <input
                                type="text"
                                value={slide.subtitle}
                                onChange={(e) => {
                                  const newSlides = [...editingTipSlides];
                                  newSlides[index] = { ...newSlides[index], subtitle: e.target.value };
                                  setEditingTipSlides(newSlides);
                                }}
                                placeholder={`Slide ${index + 1} subtitle (optional)`}
                                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 font-semibold"
                              />
                              <textarea
                                value={slide.content}
                                onChange={(e) => {
                                  const newSlides = [...editingTipSlides];
                                  newSlides[index] = { ...newSlides[index], content: e.target.value };
                                  setEditingTipSlides(newSlides);
                                }}
                                rows={3}
                                placeholder={`Slide ${index + 1} content`}
                                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                              />
                              {editingTipSlides.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newSlides = editingTipSlides.filter((_, i) => i !== index);
                                    setEditingTipSlides(newSlides);
                                  }}
                                  className="rounded-lg bg-red-100 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-200 cursor-pointer transition"
                                >
                                  Remove slide
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => setEditingTipSlides([...editingTipSlides, { subtitle: "", content: "" }])}
                            className="w-full rounded-lg border-2 border-dashed border-slate-300 px-4 py-3 text-sm font-medium text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                          >
                            + Add another slide
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const validSlides = editingTipSlides.filter(slide => slide.content.trim().length > 0);
                              updatePost({ ...editingPost, content: validSlides });
                            }}
                            className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 cursor-pointer shadow-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingPost(null);
                              setEditingTipSlides([]);
                            }}
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-semibold text-slate-900">
                          {post.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                          {Array.isArray(post.content) 
                            ? (typeof post.content[0] === 'object' && post.content[0] !== null 
                                ? post.content[0].content 
                                : String(post.content[0]))
                            : post.content}
                        </p>
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => {
                              setEditingPost(post);
                              if (Array.isArray(post.content)) {
                                setEditingTipSlides(
                                  post.content.map(s => {
                                    if (typeof s === 'object' && s !== null) {
                                      return { subtitle: s.subtitle || '', content: s.content };
                                    }
                                    return { subtitle: '', content: String(s) };
                                  })
                                );
                              } else {
                                setEditingTipSlides([{ subtitle: '', content: String(post.content) }]);
                              }
                            }}
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deletePost(post.id)}
                            className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Manage App Stories</h2>
              <input
                type="text"
                placeholder="Search apps..."
                value={appSearchQuery}
                onChange={(e) => setAppSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
              />
              {apps.length === 0 ? (
                <p className="text-center text-slate-500 py-10">No apps yet.</p>
              ) : (
                apps
                  .filter((app) =>
                    app.name.toLowerCase().includes(appSearchQuery.toLowerCase())
                  )
                  .map((app) => (
                  <div
                    key={app.id}
                    className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    {editingApp?.id === app.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editingApp.name}
                          onChange={(e) =>
                            setEditingApp({ ...editingApp, name: e.target.value })
                          }
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                        />
                        <div>
                          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-slate-300 p-3 transition hover:border-blue-400 hover:bg-blue-50">
                            {editingLogoPreview || editingApp.logo_path ? (
                              <img
                                src={editingLogoPreview || editingApp.logo_path!}
                                alt="App logo preview"
                                className="h-10 w-10 rounded-lg border border-slate-200 object-cover"
                              />
                            ) : (
                              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-500 text-xs">
                                Logo
                              </span>
                            )}
                            <span className="text-xs text-slate-600">
                              {editingLogoPreview ? "Change logo" : "Upload logo"}
                            </span>
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/webp"
                              className="sr-only"
                              onChange={handleEditingLogoUpload}
                            />
                          </label>
                        </div>
                        <input
                          type="number"
                          value={editingApp.monthly_revenue || ""}
                          onChange={(e) =>
                            setEditingApp({
                              ...editingApp,
                              monthly_revenue: e.target.value
                                ? parseFloat(e.target.value)
                                : null,
                            })
                          }
                          placeholder="Monthly revenue"
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                        />
                        <select
                          value={editingApp.revenue_period || "mrr"}
                          onChange={(e) =>
                            setEditingApp({
                              ...editingApp,
                              revenue_period: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                        >
                          <option value="mrr">MRR (Monthly Recurring Revenue)</option>
                          <option value="arr">ARR (Annual Recurring Revenue)</option>
                        </select>
                        <input
                          type="text"
                          value={editingApp.description || ""}
                          onChange={(e) =>
                            setEditingApp({
                              ...editingApp,
                              description: e.target.value,
                            })
                          }
                          placeholder="What does the app do?"
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                        />
                        <input
                          type="url"
                          value={editingApp.website_url || ""}
                          onChange={(e) =>
                            setEditingApp({
                              ...editingApp,
                              website_url: e.target.value,
                            })
                          }
                          placeholder="Website URL"
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                        />
                        <textarea
                          value={editingApp.growth_story}
                          onChange={(e) =>
                            setEditingApp({
                              ...editingApp,
                              growth_story: e.target.value,
                            })
                          }
                          rows={4}
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateApp(editingApp)}
                            className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 cursor-pointer shadow-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingApp(null);
                              setEditingLogoPreview(null);
                              setEditingLogoFile(null);
                            }}
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-semibold text-slate-900">
                          {app.name}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                          {app.growth_story}
                        </p>
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => setEditingApp(app)}
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteApp(app.id)}
                            className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </section>

        <p className="mt-5 text-center text-xs leading-5 text-slate-400">
          Posts are saved to Supabase and published immediately.
        </p>
      </div>
    </main>
  );
}
