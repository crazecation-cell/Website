import { useEffect, useState } from "react";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SEO } from "../components/site/Animated";
import { supabase, supabaseConfigured } from "../lib/supabase";

function MissingConfig() {
  return (
    <div className="mx-auto max-w-2xl border border-[#CCFF00] bg-[#0A0A0A] p-8" data-testid="admin-config-required">
      <p className="font-mono text-xs font-bold uppercase tracking-[0.28em] text-[#CCFF00]">SUPABASE REQUIRED</p>
      <h1 className="mt-5 text-4xl font-extrabold uppercase tracking-[-0.05em] text-neutral-50">Dashboard is ready. Credentials are not.</h1>
      <p className="mt-5 leading-relaxed text-neutral-400">Add the Supabase browser credentials to the frontend environment, then restart the frontend.</p>
      <div className="mt-8 border border-neutral-800 bg-neutral-950 p-5 font-mono text-xs leading-7 text-neutral-300">
        REACT_APP_SUPABASE_URL=<br />REACT_APP_SUPABASE_PUBLISHABLE_KEY=
      </div>
    </div>
  );
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/admin", { replace: true });
    });
  }, [navigate]);

  const submit = async (event) => {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setError("");
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (authError) {
      setError("Unable to sign in. Check your email and password.");
      return;
    }
    navigate("/admin", { replace: true });
  };

  return (
    <section className="flex min-h-screen items-center bg-[#070707] px-4 py-16 sm:px-6 lg:px-12" data-testid="admin-login-page">
      <SEO title="Admin Login — Crazecation" description="Secure Crazecation CMS login." />
      {!supabaseConfigured ? <MissingConfig /> : (
        <div className="mx-auto w-full max-w-md border border-neutral-800 bg-[#0A0A0A] p-8">
          <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-full bg-[#CCFF00] text-neutral-950"><LockKeyhole /></div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.28em] text-[#CCFF00]">CRAZECATION CMS</p>
          <h1 className="mt-4 text-4xl font-extrabold uppercase tracking-[-0.05em] text-neutral-50">Admin login</h1>
          <form onSubmit={submit} className="mt-8 grid gap-5" data-testid="admin-login-form">
            {error && <p data-testid="admin-login-error" className="border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
            <div>
              <label htmlFor="admin-email" className="mb-2 block font-mono text-xs uppercase tracking-[0.22em] text-neutral-500">Email</label>
              <input data-testid="admin-email-input" id="admin-email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="editorial-input" />
            </div>
            <div>
              <label htmlFor="admin-password" className="mb-2 block font-mono text-xs uppercase tracking-[0.22em] text-neutral-500">Password</label>
              <input data-testid="admin-password-input" id="admin-password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="editorial-input" />
            </div>
            <button data-testid="admin-login-submit" type="submit" disabled={busy} className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#CCFF00] text-sm font-extrabold uppercase tracking-[0.16em] text-neutral-950 transition-colors duration-300 hover:bg-neutral-50 disabled:opacity-60">
              {busy ? "SIGNING IN..." : "SIGN IN"} <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
