import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "../components/site/Animated";
import { CollectionPanel, EnquiriesPanel, MediaPanel, OverviewPanel, PagesPanel, adminFetch } from "../components/admin/AdminPanels";
import { supabase, supabaseConfigured } from "../lib/supabase";

const serviceFields = [
  { name: "number", label: "Number" }, { name: "name", label: "Name" }, { name: "short", label: "Short description", type: "textarea" },
  { name: "headline", label: "Headline lines", type: "list" }, { name: "body", label: "Body", type: "textarea" },
  { name: "items", label: "Services included", type: "list" }, { name: "tag", label: "Tag" }, { name: "image_url", label: "Image URL" },
  { name: "sort_order", label: "Sort order", type: "number" }, { name: "published", label: "Published", type: "checkbox" },
];

const clientFields = [
  { name: "name", label: "Client name" }, { name: "industry", label: "Industry" }, { name: "category", label: "Category" },
  { name: "challenge", label: "Challenge", type: "textarea" }, { name: "services_provided", label: "Services provided", type: "textarea" },
  { name: "approach", label: "Crazecation move", type: "textarea" }, { name: "result", label: "Result", type: "textarea" },
  { name: "website_url", label: "Website URL" }, { name: "social_url", label: "Social URL" }, { name: "image_url", label: "Image URL" },
  { name: "sort_order", label: "Sort order", type: "number" }, { name: "published", label: "Published", type: "checkbox" },
];

const testimonialFields = [
  { name: "client_name", label: "Client name" }, { name: "role", label: "Role" }, { name: "company", label: "Company" },
  { name: "quote", label: "Testimonial", type: "textarea" }, { name: "image_url", label: "Image URL" },
  { name: "sort_order", label: "Sort order", type: "number" }, { name: "published", label: "Published", type: "checkbox" },
];

const emptyService = { number: "", name: "", short: "", headline: [], body: "", items: [], tag: "", image_url: "", sort_order: 0, published: true };
const emptyClient = { name: "", industry: "", category: "", challenge: "", services_provided: "", approach: "", result: "", website_url: "", social_url: "", image_url: "", sort_order: 0, published: true };
const emptyTestimonial = { client_name: "", role: "", company: "", quote: "", image_url: "", sort_order: 0, published: true };

function SetupMessage() {
  return (
    <section className="min-h-screen bg-[#070707] px-4 py-20 sm:px-6 lg:px-12" data-testid="admin-setup-message">
      <div className="mx-auto max-w-3xl border border-[#CCFF00] bg-[#0A0A0A] p-8">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.28em] text-[#CCFF00]">SETUP REQUIRED</p>
        <h1 className="mt-5 text-4xl font-extrabold uppercase tracking-[-0.05em] text-neutral-50">Connect Supabase to activate the CMS.</h1>
        <div className="mt-8 border border-neutral-800 bg-neutral-950 p-5 font-mono text-xs leading-7 text-neutral-300">
          DATABASE_URL=<br />SUPABASE_URL=<br />SUPABASE_JWKS_URL=<br />SUPABASE_ISSUER=<br />SUPABASE_SECRET_KEY=<br />SUPABASE_BUCKET=cms-images
        </div>
        <p className="mt-6 text-neutral-400">Run the Alembic migration, seed script and admin creation script after adding the backend credentials.</p>
      </div>
    </section>
  );
}

export default function AdminDashboard() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [setup, setSetup] = useState(null);
  const [me, setMe] = useState(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    if (!supabase) { setLoading(false); return undefined; }
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.access_token) return;
    const token = session.access_token;
    Promise.all([
      fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/setup-status`).then((r) => r.json()),
      adminFetch("/admin/me", token),
    ]).then(([setupData, admin]) => { setSetup(setupData); setMe(admin); setError(""); })
      .catch((e) => setError(e.message));
  }, [session]);

  if (!supabaseConfigured || (!loading && setup && (!setup.database || !setup.auth || !setup.storage))) return <SetupMessage />;
  if (loading) return <section className="flex min-h-screen items-center justify-center bg-[#070707] text-neutral-400">Loading CMS...</section>;
  if (!session) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#070707] px-4" data-testid="admin-login-required">
        <div className="text-center"><h1 className="text-4xl font-extrabold uppercase">Admin login required</h1><Link data-testid="go-to-admin-login" to="/admin/login" className="mt-6 inline-flex rounded-full bg-[#CCFF00] px-6 py-3 text-sm font-extrabold uppercase text-neutral-950">Go to login</Link></div>
      </section>
    );
  }
  if (error) return <section className="flex min-h-screen items-center justify-center bg-[#070707] px-4"><div className="max-w-xl border border-red-500/40 p-8 text-red-100" data-testid="admin-access-error">{error}</div></section>;

  const tabs = [
    ["overview", "Overview"], ["pages", "Pages"], ["services", "Services"], ["clients", "Clients"], ["testimonials", "Testimonials"], ["media", "Media"], ["enquiries", "Enquiries"],
  ];
  const token = session.access_token;

  return (
    <section className="min-h-screen bg-[#070707] px-4 py-8 text-neutral-50 sm:px-6 lg:px-10" data-testid="admin-dashboard">
      <SEO title="Crazecation CMS" description="Manage Crazecation website content." />
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-5 border-b border-neutral-800 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div><p className="font-mono text-xs font-bold uppercase tracking-[0.28em] text-[#CCFF00]">CRAZECATION CMS</p><h1 className="mt-2 text-3xl font-extrabold uppercase tracking-[-0.05em]">Growth control room</h1></div>
          <button data-testid="admin-signout-button" type="button" onClick={() => supabase.auth.signOut()} className="inline-flex items-center gap-2 self-start rounded-full border border-neutral-800 px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-neutral-300 hover:border-[#CCFF00] hover:text-[#CCFF00]"><LogOut className="h-4 w-4" /> Sign out</button>
        </header>
        <div className="sticky top-0 z-20 -mx-4 mt-6 overflow-x-auto border-y border-neutral-800 bg-[#070707]/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
          <div className="flex min-w-max gap-2" data-testid="admin-tabs">
            {tabs.map(([key, label]) => <button key={key} data-testid={`admin-tab-${key}`} type="button" onClick={() => setTab(key)} className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] ${tab === key ? "border-[#CCFF00] bg-[#CCFF00] text-neutral-950" : "border-neutral-800 text-neutral-400"}`}>{label}</button>)}
          </div>
        </div>
        <div className="py-10">
          {tab === "overview" && <OverviewPanel setup={setup} me={me} />}
          {tab === "pages" && <PagesPanel token={token} />}
          {tab === "services" && <CollectionPanel title="Services" resource="services" fields={serviceFields} emptyItem={emptyService} token={token} />}
          {tab === "clients" && <CollectionPanel title="Client stories" resource="clients" fields={clientFields} emptyItem={emptyClient} token={token} />}
          {tab === "testimonials" && <CollectionPanel title="Testimonials" resource="testimonials" fields={testimonialFields} emptyItem={emptyTestimonial} token={token} />}
          {tab === "media" && <MediaPanel token={token} />}
          {tab === "enquiries" && <EnquiriesPanel token={token} />}
        </div>
      </div>
    </section>
  );
}
